import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '../../api/brandService';
import { productsApi } from '../../api/productService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ProductSelector = React.memo(({ 
  selectedProducts = [], 
  onProductSelect, 
  onProductRemove, 
  onQuantityChange,
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [expandedBrands, setExpandedBrands] = useState({});
  const { toast } = useToast();

  // Fetch brands
  const { data: brandsResponse, isLoading: brandsLoading, error: brandsError } = useQuery({
    queryKey: ['/api/brands'],
    queryFn: brandsApi.getAll,
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load brands",
        variant: "destructive"
      });
    }
  });

  // Fetch products
  const { data: productsResponse, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['/api/products', { search: searchTerm, brandId: selectedBrand }],
    queryFn: () => productsApi.getAll({ 
      search: searchTerm, 
      brandId: selectedBrand === 'all' ? undefined : selectedBrand, 
      limit: 50 
    }),
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  });

  const brands = brandsResponse?.brands || [];
  const products = productsResponse?.products || [];

  // Group products by brand
  const productsByBrand = React.useMemo(() => {
    const grouped = {};
    products.forEach(product => {
      const brandName = product.brand || 'Unknown Brand';
      if (!grouped[brandName]) {
        grouped[brandName] = [];
      }
      grouped[brandName].push(product);
    });
    return grouped;
  }, [products]);

  // Track brands that have quantities (should stay locked open)
  const brandsWithQuantities = React.useMemo(() => {
    const brandsSet = new Set();
    selectedProducts.forEach(product => {
      if (product.quantity > 0) {
        const productData = products.find(p => p._id === product._id);
        if (productData) {
          const brandName = productData.brand || 'Unknown Brand';
          brandsSet.add(brandName);
        }
      }
    });
    return brandsSet;
  }, [selectedProducts, products]);

  const toggleBrandExpansion = (brandName) => {
    setExpandedBrands(prev => {
      const isCurrentlyExpanded = prev[brandName];
      const newExpanded = {};
      
      // Always keep brands with quantities open
      brandsWithQuantities.forEach(brand => {
        newExpanded[brand] = true;
      });
      
      // Accordion behavior: if clicked brand is not currently expanded, open it and close all others
      if (!isCurrentlyExpanded) {
        newExpanded[brandName] = true;
      }
      // If clicking on expanded brand with no quantities, allow it to close
      // (brands with quantities stay open due to the loop above)
      
      return newExpanded;
    });
  };

  const handleProductToggle = (product) => {
    const isSelected = selectedProducts.some(p => p._id === product._id);
    
    if (isSelected) {
      onProductRemove(product._id);
    } else {
      onProductSelect({
        ...product,
        quantity: 1,
        totalPrice: product.price
      });
    }
  };

  const handleQuantityUpdate = (productId, value) => {
    const numQuantity = parseInt(value) || 0;
    
    if (numQuantity <= 0) {
      onProductRemove(productId);
    } else {
      // Check if product already selected
      const existingProduct = selectedProducts.find(p => p._id === productId);
      if (existingProduct) {
        onQuantityChange(productId, numQuantity);
      } else {
        // Add new product with quantity
        const product = products.find(p => p._id === productId);
        if (product) {
          onProductSelect({
            ...product,
            quantity: numQuantity,
            totalPrice: product.price * numQuantity
          });
        }
      }
    }
  };

  const getSelectedQuantity = (productId) => {
    const selectedProduct = selectedProducts.find(p => p._id === productId);
    return selectedProduct?.quantity || 0;
  };

  if (brandsError || productsError) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Failed to load product data. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Select Products
        </CardTitle>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="sm:w-48">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map(brand => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {brandsLoading || productsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(productsByBrand).map(([brandName, brandProducts]) => {
              const hasQuantities = brandsWithQuantities.has(brandName);
              const isExpanded = expandedBrands[brandName];
              
              return (
              <div key={brandName} className="border rounded-lg">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBrandExpansion(brandName);
                  }}
                  className={`w-full flex items-center justify-between p-3 transition-colors ${
                    hasQuantities && isExpanded 
                      ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={hasQuantities ? "default" : "secondary"}>
                      {brandName}
                    </Badge>
                    {hasQuantities && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Selected
                      </Badge>
                    )}
                    <span className="text-sm text-gray-600">
                      {brandProducts.length} products
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className={`h-4 w-4 ${hasQuantities ? 'text-blue-500' : ''}`} />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedBrands[brandName] && (
                  <div className="border-t">
                    {/* Header Row */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span>ITEM NAME</span>
                      <span className="w-20 text-center">QUANTITY</span>
                    </div>
                    
                    {/* Product Rows */}
                    <div className="space-y-0 divide-y">
                      {brandProducts.map(product => {
                        const selectedQuantity = getSelectedQuantity(product._id);
                        const isSelected = selectedQuantity > 0;

                      return (
                        <div
                          key={product._id}
                          className={`flex items-center justify-between p-3 rounded border transition-colors ${
                            isSelected ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover"
                              onError={(e) => {
                                e.target.src = '/uploads/products/default-product.jpg';
                              }}
                            />
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-green-600 font-semibold">
                                ₹{product.price}
                              </p>
                            </div>
                          </div>

                          <div className="w-20">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={selectedQuantity || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleQuantityUpdate(product._id, e.target.value);
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              onFocus={(e) => {
                                e.stopPropagation();
                              }}
                              onKeyDown={(e) => {
                                e.stopPropagation();
                              }}
                              onInput={(e) => {
                                e.stopPropagation();
                              }}
                              className="w-full text-center text-sm h-8"
                            />
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
              );
            })}

            {Object.keys(productsByBrand).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || selectedBrand ? 'No products found matching your search.' : 'No products available.'}
              </div>
            )}
          </div>
        )}

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Selected Products ({selectedProducts.length})</h4>
            <div className="space-y-2">
              {selectedProducts.map(product => (
                <div key={product._id} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="font-medium">
                    {product.quantity}x ₹{product.price} = ₹{product.totalPrice}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total Amount:</span>
                <span>₹{selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default ProductSelector;