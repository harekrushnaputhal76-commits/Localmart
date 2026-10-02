/**
 * LOCAL MART - FULL-STACK CLIENT ENGINE
 * Handles State, LocalStorage DB, Reactive UI, Checkout, and Delivery
 */

(function () {
  'use strict';

  // --- 1. LOCAL DATABASE & SEED DATA ---
  const DEFAULT_PRODUCTS = [
    {
      id: 'p-1',
      title: 'iPhone 13 Pro 128GB (Graphite)',
      price: 42999,
      category: 'Mobiles',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=500&q=80',
      badge: 'Fast Delivery',
      seller: 'Amit Sharma',
      location: 'HSR Layout (2.4 km away)',
      description: 'Pristine condition, 89% battery health. Comes with original box, cable, and Bill. Selling because upgraded to 15 Pro.'
    },
    {
      id: 'p-2',
      title: 'Ergonomic High-Back Office Chair',
      price: 3499,
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=500&q=80',
      badge: 'Free Delivery',
      seller: 'Priya Mehta',
      location: 'Koramangala (1.2 km away)',
      description: 'Featherlite breathable mesh chair with adjustable lumbar support and headrest. Used for 6 months only.'
    },
    {
      id: 'p-3',
      title: 'Sony WH-1000XM4 Wireless Headphones',
      price: 14999,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
      badge: 'Fast Delivery',
      seller: 'Kiran Patel',
      location: 'Indiranagar (3.8 km away)',
      description: 'Industry-leading noise cancellation, 30 hours battery life. Includes carry case and aux cable. Excellent sound quality.'
    },
    {
      id: 'p-4',
      title: '21-Speed Hybrid Mountain Bike',
      price: 7250,
      category: 'Vehicles',
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&q=80',
      badge: 'Fast Delivery',
      seller: 'Vikram Joshi',
      location: 'BTM Layout (1.8 km away)',
      description: 'Lightweight alloy frame, front suspension fork, Shimano dual shifters. Recently serviced with new puncture-resistant tyres.'
    },
    {
      id: 'p-5',
      title: 'Apple MacBook Air M1 (256GB SSD, Space Grey)',
      price: 52999,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      badge: 'Verified Seller',
      seller: 'Sneha Roy',
      location: 'Bellandur (4.1 km away)',
      description: 'Flawless condition MacBook Air M1 with 8GB unified memory and retina display. Original 30W adapter and bill included.'
    },
    {
      id: 'p-6',
      title: 'Solid Sheesham Wood Study & Work Desk',
      price: 2800,
      category: 'Furniture',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&q=80',
      badge: 'Free Delivery',
      seller: 'Arjun Das',
      location: 'Whitefield (3.0 km away)',
      description: 'Solid wooden table with 2 drawers and cable pass-through grommet. Perfect for work from home or students.'
    }
  ];

  const LocalMartDB = {
    getProducts: function () {
      const data = localStorage.getItem('localmart_products');
      if (!data) {
        localStorage.setItem('localmart_products', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        return DEFAULT_PRODUCTS;
      }
    },
    addProduct: function (product) {
      const products = this.getProducts();
      products.unshift(product);
      localStorage.setItem('localmart_products', JSON.stringify(products));
      
      // Also save to user active listings
      const myListings = this.getMyListings();
      myListings.unshift(product);
      localStorage.setItem('localmart_my_listings', JSON.stringify(myListings));
      return product;
    },
    getMyListings: function () {
      const data = localStorage.getItem('localmart_my_listings');
      return data ? JSON.parse(data) : [];
    },
    getOrders: function () {
      const data = localStorage.getItem('localmart_orders');
      if (!data) {
        const seedOrders = [
          {
            id: 'LM-91823',
            title: 'Sony WH-1000XM4 Wireless Headphones',
            price: 14999,
            total: 15048,
            date: 'Today, 2:15 PM',
            status: 'Out for Delivery',
            partner: 'Rahul Kumar (Local Rider)',
            address: 'HSR Layout, Sector 4, Bengaluru'
          }
        ];
        localStorage.setItem('localmart_orders', JSON.stringify(seedOrders));
        return seedOrders;
      }
      return JSON.parse(data);
    },
    addOrder: function (order) {
      const orders = this.getOrders();
      orders.unshift(order);
      localStorage.setItem('localmart_orders', JSON.stringify(orders));
      
      // Add to delivery tasks
      const tasks = this.getDeliveryTasks();
      tasks.unshift({
        id: order.id,
        item: order.title,
        pickup: 'Seller Hub (Indiranagar 100ft Rd)',
        drop: order.address,
        payout: '₹120 Delivery Earning',
        status: 'Assigned'
      });
      localStorage.setItem('localmart_delivery_tasks', JSON.stringify(tasks));
      return order;
    },
    getDeliveryTasks: function () {
      const data = localStorage.getItem('localmart_delivery_tasks');
      if (!data) {
        const seedTasks = [
          {
            id: 'LM-91823',
            item: 'Sony WH-1000XM4 Wireless Headphones',
            pickup: 'Indiranagar 100ft Rd (Kiran Patel)',
            drop: 'HSR Layout, Sector 4, Flat 402',
            payout: '₹120',
            status: 'Assigned'
          }
        ];
        localStorage.setItem('localmart_delivery_tasks', JSON.stringify(seedTasks));
        return seedTasks;
      }
      return JSON.parse(data);
    },
    completeDeliveryTask: function (taskId) {
      const tasks = this.getDeliveryTasks();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.status = 'Delivered';
        localStorage.setItem('localmart_delivery_tasks', JSON.stringify(tasks));
      }
      // Update order status
      const orders = this.getOrders();
      const order = orders.find(o => o.id === taskId);
      if (order) {
        order.status = 'Delivered';
        localStorage.setItem('localmart_orders', JSON.stringify(orders));
      }
    }
  };

  // --- 2. TOAST NOTIFICATION UTILITY ---
  function showToast(message, icon = '✓') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- 3. PAGE INITIALIZATION ROUTER ---
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initPathHelpers();

    const path = window.location.pathname.toLowerCase();
    
    if (path.endsWith('home.html') || path.endsWith('index.html') || path === '/' || path.endsWith('/local%20mart/')) {
      initHomePage();
    }
    if (path.endsWith('product-detail.html')) {
      initProductDetailPage();
    }
    if (path.endsWith('sell.html')) {
      initSellPage();
    }
    if (path.endsWith('checkout.html')) {
      initCheckoutPage();
    }
    if (path.endsWith('order-success.html')) {
      initOrderSuccessPage();
    }
    if (path.endsWith('profile.html')) {
      initProfilePage();
    }
    if (path.endsWith('settings.html')) {
      initSettingsPage();
    }
    if (path.endsWith('delivery-dashboard.html')) {
      initDeliveryDashboard();
    }
    if (path.endsWith('admin-dashboard.html')) {
      initAdminDashboard();
    }
    if (path.endsWith('categories.html')) {
      initCategoriesPage();
    }
  });

  // --- 4. THEME SUPPORT ---
  function initTheme() {
    const savedTheme = localStorage.getItem('localmart_theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
    }
  }

  function toggleTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      localStorage.setItem('localmart_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('localmart_theme', 'light');
    }
  }

  // --- 5. PATH HELPER (Root vs /src/pages/) ---
  function getPageUrl(targetPage) {
    const inPagesDir = window.location.pathname.includes('/src/pages/');
    if (inPagesDir) {
      return targetPage;
    }
    return `src/pages/${targetPage}`;
  }

  function initPathHelpers() {
    // Correct link hrefs dynamically if needed
    const inPagesDir = window.location.pathname.includes('/src/pages/');
    document.querySelectorAll('a[data-route]').forEach(link => {
      const page = link.getAttribute('data-route');
      link.href = inPagesDir ? page : `src/pages/${page}`;
    });
  }

  // --- 6. HOME PAGE ENGINE ---
  function initHomePage() {
    const productGrid = document.querySelector('.product-grid');
    const searchInput = document.querySelector('input[type="search"]');
    const categorySlider = document.querySelector('.category-slider');
    const userLocationElem = document.getElementById('user-location');

    // Dynamic Location Detection
    if (userLocationElem) {
      userLocationElem.style.cursor = 'pointer';
      userLocationElem.addEventListener('click', function () {
        if (navigator.geolocation) {
          userLocationElem.textContent = 'Detecting GPS...';
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              userLocationElem.textContent = 'Deliver to: HSR Layout, Bengaluru (GPS Live)';
              showToast('Location updated via GPS');
            },
            () => {
              userLocationElem.textContent = 'Deliver to: Indiranagar, Bengaluru';
              showToast('Using local hyper-market area');
            }
          );
        }
      });
    }

    const allProducts = LocalMartDB.getProducts();

    function renderProducts(items) {
      if (!productGrid) return;
      if (items.length === 0) {
        productGrid.innerHTML = `
          <div style="grid-column: span 2; text-align: center; padding: 40px 15px; color: var(--text-muted);">
            <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
            <strong>No items found in your area</strong>
            <p style="font-size: 12px; margin-top: 4px;">Try searching for another keyword or post your item first!</p>
          </div>
        `;
        return;
      }

      productGrid.innerHTML = items.map(item => `
        <div class="product-card">
          <div class="card-img-wrap">
            <span class="badge">${item.badge || 'Fast Delivery'}</span>
            <img src="${item.image}" alt="${item.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://placehold.co/400x400/eeeeee/999999?text=Local+Item'">
          </div>
          <div class="product-title">${item.title}</div>
          <div class="product-price">
            ₹${item.price.toLocaleString('en-IN')}
            <span class="delivery-tag">FREE Delivery</span>
          </div>
          <button type="button" class="btn-buy" onclick="window.LocalMart.startCheckout('${item.id}')">
            Buy Now
          </button>
        </div>
      `).join('');
    }

    renderProducts(allProducts);

    // Live Instant Search
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
        );
        renderProducts(filtered);
      });
    }

    // Category Slider Filters
    if (categorySlider) {
      categorySlider.querySelectorAll('.slider-item').forEach(item => {
        item.addEventListener('click', function (e) {
          const catName = item.querySelector('span') ? item.querySelector('span').textContent.trim() : '';
          if (catName) {
            e.preventDefault();
            searchInput.value = catName;
            const filtered = allProducts.filter(p => p.category.toLowerCase() === catName.toLowerCase());
            renderProducts(filtered.length > 0 ? filtered : allProducts);
            showToast(`Filtering by ${catName}`);
          }
        });
      });
    }
  }

  // --- 7. PRODUCT DETAIL ENGINE ---
  function initProductDetailPage() {
    const products = LocalMartDB.getProducts();
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id') || localStorage.getItem('localmart_selected_product_id') || products[0].id;
    const item = products.find(p => p.id === prodId) || products[0];

    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
      <div style="background: var(--surface); border-radius: var(--radius-md); overflow: hidden; margin-bottom: 14px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 260px; object-fit: cover;" referrerpolicy="no-referrer">
        <div style="padding: 16px;">
          <span class="badge" style="position: static; display: inline-block; margin-bottom: 8px;">${item.badge || 'Verified'}</span>
          <h2 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 8px;">${item.title}</h2>
          <div style="font-size: 22px; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
            ₹${item.price.toLocaleString('en-IN')}
          </div>
          <div style="color: var(--success); font-weight: 700; font-size: 12px; margin-bottom: 12px;">
            ✓ Price includes local home delivery (No seller contact needed)
          </div>
          <div style="background: var(--bg-app); padding: 10px 12px; border-radius: 8px; font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
            📍 <strong>Location:</strong> ${item.location || 'Within 3 km of your area'}<br>
            👤 <strong>Seller:</strong> ${item.seller || 'Verified Local Neighbor'}
          </div>
          <h4 style="font-size: 13px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;">Description</h4>
          <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-secondary); margin-bottom: 18px;">
            ${item.description}
          </p>
          <button type="button" class="btn-buy" style="padding: 14px; font-size: 14px;" onclick="window.LocalMart.startCheckout('${item.id}')">
            Buy Now - Home Delivery
          </button>
        </div>
      </div>
    `;
  }

  // --- 8. SELL PAGE ENGINE ---
  function initSellPage() {
    const form = document.querySelector('form');
    if (!form) return;

    const fileInput = document.getElementById('product-image');
    let previewDataUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';

    if (fileInput) {
      fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (ev) {
            previewDataUrl = ev.target.result;
            showToast('Photo selected successfully');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = document.getElementById('product-title')?.value || 'New Local Item';
      const description = document.getElementById('product-description')?.value || 'Gently used item from local neighbor.';
      const price = parseFloat(document.getElementById('product-price')?.value) || 999;
      const category = document.getElementById('product-category')?.value || 'Others';

      const newProduct = {
        id: 'p-' + Date.now(),
        title: title,
        price: price,
        category: category.charAt(0).toUpperCase() + category.slice(1),
        image: previewDataUrl,
        badge: 'Newly Listed',
        seller: 'You (Local Seller)',
        location: 'Within 2.0 km',
        description: description
      };

      LocalMartDB.addProduct(newProduct);
      showToast('Item posted successfully!', '🎉');
      setTimeout(() => {
        window.location.href = getPageUrl('home.html');
      }, 1000);
    });
  }

  // --- 9. CHECKOUT ENGINE ---
  function initCheckoutPage() {
    const itemData = localStorage.getItem('localmart_checkout_item');
    const product = itemData ? JSON.parse(itemData) : LocalMartDB.getProducts()[0];

    // Update dynamically if elements exist
    const priceDisplay = document.querySelector('.bill-row span:last-child');
    const totalDisplay = document.querySelector('.bill-row.total strong:last-child');
    const bottomTotalDisplay = document.querySelector('.checkout-bottom-bar strong');

    if (product) {
      const total = product.price + 49;
      if (priceDisplay) priceDisplay.textContent = `₹${product.price.toLocaleString('en-IN')}`;
      if (totalDisplay) totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
      if (bottomTotalDisplay) bottomTotalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    // GPS Detect Button
    const gpsBtn = document.querySelector('.btn-gps');
    const addressBox = document.querySelector('.address-box');
    if (gpsBtn && addressBox) {
      gpsBtn.addEventListener('click', function () {
        gpsBtn.textContent = 'Detecting current GPS...';
        setTimeout(() => {
          addressBox.innerHTML = `
            <strong>Verified GPS Location</strong><br>
            Flat 204, Sai Meadows, 5th Main, 14th Cross<br>
            Near BDA Complex, HSR Layout, Bengaluru - 560102<br>
            Phone: +91 98765 43210
          `;
          gpsBtn.innerHTML = `✓ Location Verified`;
          gpsBtn.style.borderColor = '#10b981';
          gpsBtn.style.color = '#10b981';
          showToast('GPS coordinates locked');
        }, 600);
      });
    }

    // Place Order Button
    const placeOrderBtn = document.querySelector('.btn-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'cod';
        const newOrder = {
          id: 'LM-' + Math.floor(10000 + Math.random() * 90000),
          title: product.title,
          price: product.price,
          total: product.price + 49,
          date: 'Just now',
          status: 'Order Confirmed',
          partner: 'Rahul Kumar (Local Rider)',
          address: 'HSR Layout, Sector 4, Bengaluru',
          payment: selectedMethod.toUpperCase()
        };

        LocalMartDB.addOrder(newOrder);
        localStorage.setItem('localmart_last_order', JSON.stringify(newOrder));
        showToast('Order Placed Successfully!', '🚀');
        setTimeout(() => {
          window.location.href = getPageUrl('order-success.html');
        }, 600);
      });
    }
  }

  // --- 10. ORDER SUCCESS ENGINE ---
  function initOrderSuccessPage() {
    const lastOrderData = localStorage.getItem('localmart_last_order');
    if (!lastOrderData) return;
    const order = JSON.parse(lastOrderData);

    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
      <div style="background: var(--surface); border-radius: 16px; padding: 24px; text-align: center; box-shadow: var(--shadow-sm); border: 1px solid var(--border); margin: 20px 14px;">
        <div style="width: 68px; height: 68px; border-radius: 50%; background: #e8f5e9; color: #2e7d32; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px auto;">
          ✓
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Order Placed!</h2>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
          Order ID: <strong>#${order.id}</strong><br>
          Your order for <strong>${order.title}</strong> is confirmed.
        </p>
        <div style="background: var(--bg-app); border-radius: 10px; padding: 14px; text-align: left; font-size: 13px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Total Paid (COD):</span> <strong>₹${order.total.toLocaleString('en-IN')}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Delivery Agent:</span> <strong>${order.partner}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Status:</span> <strong style="color: #2874f0;">${order.status}</strong>
          </div>
        </div>
        <a href="${getPageUrl('home.html')}" style="text-decoration: none;">
          <button type="button" class="btn-buy" style="padding: 12px; font-size: 14px;">Back to Home</button>
        </a>
      </div>
    `;
  }

  // --- 11. PROFILE ENGINE ---
  function initProfilePage() {
    const myListings = LocalMartDB.getMyListings();
    const orders = LocalMartDB.getOrders();

    const listingsSection = document.querySelector('section:nth-of-type(1) ul, section:nth-of-type(1)');
    const ordersSection = document.querySelector('section:nth-of-type(2) ul, section:nth-of-type(2)');

    if (myListings.length > 0 && listingsSection) {
      listingsSection.innerHTML = `
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">My Active Listings (${myListings.length})</h3>
        ${myListings.map(item => `
          <div style="display: flex; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <img src="${item.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
            <div style="flex: 1;">
              <div style="font-size: 13px; font-weight: 600;">${item.title}</div>
              <div style="font-size: 12px; color: var(--primary); font-weight: 700;">₹${item.price.toLocaleString('en-IN')}</div>
            </div>
            <span style="font-size: 10px; background: #e8f5e9; color: #2e7d32; padding: 2px 6px; border-radius: 4px;">Active</span>
          </div>
        `).join('')}
      `;
    }

    if (orders.length > 0 && ordersSection) {
      ordersSection.innerHTML = `
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">Recent Orders (${orders.length})</h3>
        ${orders.map(order => `
          <div style="padding: 10px 0; border-bottom: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600;">
              <span>${order.title}</span>
              <span>₹${order.total.toLocaleString('en-IN')}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-top: 4px;">
              <span>ID: #${order.id}</span>
              <span style="color: #2874f0; font-weight: 700;">${order.status}</span>
            </div>
          </div>
        `).join('')}
      `;
    }
  }

  // --- 12. SETTINGS ENGINE ---
  function initSettingsPage() {
    const darkToggle = document.getElementById('dark-toggle');
    if (darkToggle) {
      darkToggle.checked = localStorage.getItem('localmart_theme') === 'dark';
      darkToggle.addEventListener('change', function () {
        toggleTheme(darkToggle.checked);
        showToast(darkToggle.checked ? 'Dark theme enabled' : 'Light theme enabled');
      });
    }
  }

  // --- 13. DELIVERY DASHBOARD ENGINE ---
  function initDeliveryDashboard() {
    const tasksList = document.querySelector('main ul');
    const statusToggle = document.getElementById('status-toggle');

    if (statusToggle) {
      statusToggle.addEventListener('change', function () {
        showToast(statusToggle.checked ? 'You are now Online (Receiving tasks)' : 'You are now Offline');
      });
    }

    function renderTasks() {
      const tasks = LocalMartDB.getDeliveryTasks();
      if (!tasksList) return;

      if (tasks.length === 0) {
        tasksList.innerHTML = '<li style="padding: 20px; text-align: center; color: var(--text-muted);">No new tasks assigned yet.</li>';
        return;
      }

      tasksList.innerHTML = tasks.map(task => `
        <li style="background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 14px;">
            <span>#${task.id} - ${task.item}</span>
            <span style="color: var(--success);">${task.payout}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">📍 <strong>Pickup:</strong> ${task.pickup}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">🏠 <strong>Drop:</strong> ${task.drop}</div>
          <div style="margin-top: 8px;">
            ${task.status === 'Delivered'
              ? '<span style="font-size: 12px; color: var(--success); font-weight: 700;">✓ Delivered Successfully</span>'
              : `<button type="button" class="btn-buy" onclick="window.LocalMart.completeDelivery('${task.id}')">Mark as Delivered</button>`
            }
          </div>
        </li>
      `).join('');
    }

    renderTasks();
  }

  // --- 14. ADMIN DASHBOARD ENGINE ---
  function initAdminDashboard() {
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    const orders = LocalMartDB.getOrders();
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.title}</td>
        <td>User Buyer</td>
        <td>${order.address}</td>
        <td>₹${order.total.toLocaleString('en-IN')}</td>
        <td><span style="color: #2874f0; font-weight: 700;">${order.status}</span></td>
      </tr>
    `).join('');
  }

  // --- 15. CATEGORIES ENGINE ---
  function initCategoriesPage() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', function () {
        const catName = card.querySelector('span')?.textContent || '';
        window.location.href = `${getPageUrl('home.html')}?cat=${encodeURIComponent(catName)}`;
      });
    });
  }

  // --- 16. GLOBAL EXPOSURE ---
  window.LocalMart = {
    DB: LocalMartDB,
    startCheckout: function (productId) {
      const products = LocalMartDB.getProducts();
      const item = products.find(p => p.id === productId) || products[0];
      localStorage.setItem('localmart_checkout_item', JSON.stringify(item));
      localStorage.setItem('localmart_selected_product_id', productId);
      window.location.href = getPageUrl('checkout.html');
    },
    viewProduct: function (productId) {
      localStorage.setItem('localmart_selected_product_id', productId);
      window.location.href = `${getPageUrl('product-detail.html')}?id=${productId}`;
    },
    completeDelivery: function (taskId) {
      LocalMartDB.completeDeliveryTask(taskId);
      showToast('Delivery marked complete!', '🎉');
      initDeliveryDashboard();
    }
  };

})();
