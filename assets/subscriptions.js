(function( $ , Handlebars) {
      
      window.GrinSubscription = (function() {
        var self;

        function initHandlebars () {

            var groupSrc = document.getElementById("product-group-template").innerHTML;
            self.groupTemplate = Handlebars.compile(groupSrc);

            Handlebars.registerHelper('each', function(context, options) {
                var ret = "";

                if (context != undefined) {
                  for(var i=0, j=context.length; i<j; i++) {
                      ret = ret + options.fn(context[i]);
                  }
                }
              
                return ret;
            });

            Handlebars.registerHelper('defaultName', function(variants) {
                return variants[0].title;
            });

            Handlebars.registerHelper('cssClass', function(str) {
                return str.replace(/\s+/g, '-').toLowerCase();
            });

            Handlebars.registerHelper('instockClass', function(available) {
                return (available)?"in-stock":"out-of-stock";
            });

            Handlebars.registerHelper('showSwatchClass', function(variants) {
                return (variants.length > 1)?"has-swatches":"no-swatches";
            });

            Handlebars.registerHelper('formatPrice', function(num) {
                return (num/100).toFixed( 2 );
            });

            Handlebars.registerHelper('productSelectedClass', function(product) {
                return  (product.selected)?"selected":"not-selected";
            });

            Handlebars.registerHelper('variantSelectedClass', function(variant) {
                return  (variant.selected)?"selected":"not-selected";
            });

            Handlebars.registerHelper('recurringText', function(product) {
                if (product.subscription !== undefined && product.subscription.shipping_interval_frequency !== undefined) {
                    return "Delivered every "+product.subscription.shipping_interval_frequency+" "+product.subscription.shipping_interval_unit_type.toLowerCase();
                } else {
                    return "One off purchase";
                }
            });

            Handlebars.registerHelper('productImage', function(product) {

                if(product == undefined) {
                    return '';
                }

                if (product.selectedVariant && product.selectedVariant.featured_image) {
                    str = '<img src="'+product.selectedVariant.featured_image.src+'" height="'+product.selectedVariant.featured_image.height+'" width="'+product.selectedVariant.featured_image.width+'" />';
                } else {
                    str = '<img src="'+product.data.featured_image+'" />';
                }


                $.each(product.data.variants, function(key, variant) {
                    if (variant.featured_image) {
                      str += '<img style="display:none;" src="'+variant.featured_image.src+'" />';
                    }
                });

                $.each(product.siblings, function(key, sibling) {
                    if (sibling.selectedVariant && sibling.selectedVariant.featured_image) {
                        str += '<img style="display:none;" src="'+sibling.selectedVariant.featured_image.src+'" />';
                    } else {
                        if(sibling.data) {
                            str += '<img style="display:none;" src="'+sibling.data.featured_image+'" />';
                        }
                        
                    }


                });

                return str;
            });
        };

        function initProducts (productGroups, productData) {

           $.each(productGroups, function(key, group) {

              var i = 0,
                  selectors = self.selectors;

              group.$el = $(selectors.parentSelector+"[data-group="+key+"]").first();
              group.id = key;
              
              $.each(group.products, function(key, product) {


                  if (productData[key]) {
                    Object.assign(product, productData[key]);
                  }

                  if (product.data === undefined) {
                    return;
                  }

                  product.siblings = $.map(group.products, function(el) { return el });

                  if (i == 0) {
                    product.selected = true;
                    group.selected = product;
                  } else {
                    product.selected = false;
                  }

                  product.groupId = group.id;

                  if (product.data.variants ) {

                    $.each(product.data.variants, function(key, variant) {
                       if (variant.featured_image) {
                          var preload = new Image();
                          preload.src = variant.featured_image.src;
                       }
                       
                    });

                    if (product.selectedVariant == undefined) {
                        product.selectedVariant = product.data.variants[0];
                        product.selectedVariant.selected = true;
                    }
                  }
                  

                  //preload featured image
                  var preload = new Image();
                  preload.src = product.data.featured_image;

                  // group.products[product.data.id] = product;
                  i++;
             });
          });

          self.productGroups = productGroups;
        };

        function render() {
             console.log(self.productGroups);

            $(self.selectors.parentSelector).each(function() {
                var gid = $(this).attr('data-group'),
                    i = 0,
                    pg = self.productGroups;
                    
                if (pg[gid] !== undefined) {
                  $(selectors.parentSelector+"[data-group="+gid+"]").first().replaceWith(self.groupTemplate(pg[gid]))
                }
            });

           self.bindEvents();
        };


        function updateCart() {
            jQuery.ajax({
              cache: false,
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              type: "GET",
              url: '/cart.js',
              success: function(res) {
                $('.cart-count').html(res.item_count)
              }
            });
        };


        return {

            publicProperty: '',

            init: function(productGroups, productData) {
                self = this,
                    selectors = {};


                selectors.parentSelector = '.subscription-group',
                selectors.productSelector = '.subscription-group-product',
                selectors.swatchSelector = '.subscription-group-swatch',
                selectors.swatchLabelSelector = '.subscription-group-swatch-name',
                selectors.planSelector = '.subscription-group-plan',
                selectors.freqSelector = '.subscription-group-frequency'
                selectors.priceSelector = '.subscription-group-total-value';
                selectors.addTo = '.button-addto';

                self.selectors = selectors;


                initHandlebars();
                initProducts(productGroups, productData);
                render();
            },

            privilegedMethod: function(args) {
                return privateMethod(args);
            },


            bindEvents: function() {
                var selectors = self.selectors;

                $(selectors.planSelector).click(function() {
                    var gid = $(this).attr('data-group-id'),
                        pid = $(this).attr('data-product-id'),
                        group = self.productGroups[gid];
                    if (group) {
                      $.each(group.products, function(key, product) {
                          if (product && product.data) {
                              if (product.data.handle == pid) {
                                  product.selected = true;
                                  group.selected = product;
                              } else {
                                  product.selected = false;
                              }
                          } else {
                              console.log('data missing');
                              console.log(product);
                          }
                      });
                    }
                    
                    render();
                });


                $(selectors.swatchSelector).click(function() {
                  
                    var selectors = self.selectors,
                        gid = $(this).parents(selectors.parentSelector).attr('data-group'),
                        pid = $(this).parents(selectors.productSelector).attr('data-product-id'),
                        vid = $(this).attr('data-variant-id'),
                        product = self.productGroups[gid].products[pid];


                    product.selectedVariant = null;

                    $.each(product.data.variants, function(key, variant) {

                        if (variant !== undefined) {
                            if (variant.id == vid) {
                                variant.selected = vid;
                                product.selectedVariant = variant;
                            } else {
                                variant.selected = false;
                            }
                        }
                    });

                    render();
                });

                $(selectors.addTo).click(function(e) {
                    e.preventDefault();

                    var selectors = self.selectors,
                        gid = $(this).parents(selectors.parentSelector).attr('data-group'),
                        pid = $(this).parents(selectors.productSelector).attr('data-product-id'),
                        product = self.productGroups[gid].products[pid],
                        $button = $(this);

                    if (product.subscription !== undefined && product.subscription.discount_product_id !== undefined) {
                        postData = {
                            "quantity": 1,
                            "purchase_type": 'autodeliver',
                            "id": product.subscription_variants[product.selectedVariant.id].discount_variant_id, // what should this be?
                            "properties": {
                                "shipping_interval_frequency": product.subscription['shipping_interval_frequency'],
                                "shipping_interval_unit_type": product.subscription['shipping_interval_unit_type'],
                                "subscription_id": product.subscription['subscription_id']
                            }
                        }
                    } else {
                        postData = {
                            "quantity": 1,
                            "id": product.selectedVariant.id
                        }
                    }


                    $button.addClass('is-loading');

                    var params = {
                        type: 'POST',
                        url: '/cart/add.js',
                        data: postData,
                        dataType: 'json',
                        success: function(line_item) { 
                          $button.removeClass('is-loading');
                          $button.addClass('is-success');
                          

                          setTimeout(function() {
                              $button.removeClass('is-success');
                          }, 3000);
                          console.log(line_item);
                          console.log(line_item.product_title+' was added to your cart');
                          updateCart();



                        },
                        error: function() {
                          $button.removeClass('is-loading');
                          console.log("fail");
                        }
                    };

                    $.ajax(params);
                });
          }
        };
      })();

}( jQuery , Handlebars));
