/**
 * LOCAL MART - FULL-STACK CLIENT ENGINE
 * Apple iOS 100x Architecture + 3-Way Role Authentication & Staff Management
 */

(function () {
  'use strict';

  // --- 1. DEFAULT SEED DATA ---
  const DEFAULT_ADMIN = {
    username: 'Gudu7894',
    password: 'Puthal@123',
    name: 'Gudu (Master Admin)',
    role: 'Super Admin'
  };

  const DEFAULT_EMPLOYEES = [
    {
      id: 'EMP101',
      name: 'Rohan Sharma',
      pass: 'Staff@123',
      role: 'Listing Approver',
      status: 'Active',
      createdAt: '2026-09-15'
    },
    {
      id: 'EMP102',
      name: 'Kavita Singh',
      pass: 'Staff@456',
      role: 'Operations & Dispatch',
      status: 'Active',
      createdAt: '2026-09-20'
    }
  ];

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
      description: 'Pristine condition, 89% battery health. Comes with original box, cable, and Bill.',
      status: 'Approved'
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
      description: 'Featherlite breathable mesh chair with adjustable lumbar support and headrest.',
      status: 'Approved'
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
      description: 'Industry-leading noise cancellation, 30 hours battery life. Includes carry case.',
      status: 'Approved'
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
      description: 'Lightweight alloy frame, front suspension fork, Shimano dual shifters.',
      status: 'Approved'
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
      description: 'Flawless condition MacBook Air M1 with 8GB unified memory and retina display.',
      status: 'Approved'
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
      description: 'Solid wooden table with 2 drawers. Perfect for work from home or students.',
      status: 'Approved'
    }
  ];

  // --- 2. LOCAL DATABASE ENGINE ---
  const LocalMartDB = {
    // Admin Credentials (Can be modified)
    getAdminCreds: function () {
      const data = localStorage.getItem('localmart_admin_creds');
      if (!data) {
        localStorage.setItem('localmart_admin_creds', JSON.stringify(DEFAULT_ADMIN));
        return DEFAULT_ADMIN;
      }
      return JSON.parse(data);
    },
    updateAdminCreds: function (newUsername, newPassword) {
      const current = this.getAdminCreds();
      current.username = newUsername;
      current.password = newPassword;
      localStorage.setItem('localmart_admin_creds', JSON.stringify(current));
      return current;
    },

    // Employee Accounts Management
    getEmployees: function () {
      const data = localStorage.getItem('localmart_employees');
      if (!data) {
        localStorage.setItem('localmart_employees', JSON.stringify(DEFAULT_EMPLOYEES));
        return DEFAULT_EMPLOYEES;
      }
      return JSON.parse(data);
    },
    addEmployee: function (name, empId, password, role) {
      const employees = this.getEmployees();
      if (employees.some(e => e.id.toLowerCase() === empId.toLowerCase())) {
        throw new Error('Employee ID already exists. Please choose another.');
      }
      const newEmp = {
        id: empId,
        name: name,
        pass: password,
        role: role || 'Staff Member',
        status: 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      employees.push(newEmp);
      localStorage.setItem('localmart_employees', JSON.stringify(employees));
      return newEmp;
    },
    deleteEmployee: function (empId) {
      let employees = this.getEmployees();
      employees = employees.filter(e => e.id !== empId);
      localStorage.setItem('localmart_employees', JSON.stringify(employees));
      return employees;
    },

    // Products Management
    getProducts: function (includeAll = false) {
      const data = localStorage.getItem('localmart_products');
      let products = DEFAULT_PRODUCTS;
      if (data) {
        try {
          products = JSON.parse(data);
        } catch (e) {
          products = DEFAULT_PRODUCTS;
        }
      } else {
        localStorage.setItem('localmart_products', JSON.stringify(DEFAULT_PRODUCTS));
      }
      if (includeAll) return products;
      // Normal buyers only see Approved listings
      return products.filter(p => p.status === 'Approved' || !p.status);
    },
    addProduct: function (product) {
      const products = this.getProducts(true);
      product.status = 'Approved'; // Can also be set to Pending
      products.unshift(product);
      localStorage.setItem('localmart_products', JSON.stringify(products));

      const myListings = this.getMyListings();
      myListings.unshift(product);
      localStorage.setItem('localmart_my_listings', JSON.stringify(myListings));
      return product;
    },
    updateProduct: function (productId, updatedFields) {
      const products = this.getProducts(true);
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        localStorage.setItem('localmart_products', JSON.stringify(products));
        return products[index];
      }
      return null;
    },
    deleteProduct: function (productId) {
      let products = this.getProducts(true);
      products = products.filter(p => p.id !== productId);
      localStorage.setItem('localmart_products', JSON.stringify(products));
      return products;
    },
    getMyListings: function () {
      const data = localStorage.getItem('localmart_my_listings');
      return data ? JSON.parse(data) : [];
    },

    // Orders Management
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
            address: 'HSR Layout, Sector 4, Bengaluru',
            buyer: 'Rajesh Sharma'
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

      const tasks = this.getDeliveryTasks();
      tasks.unshift({
        id: order.id,
        item: order.title,
        pickup: 'Seller Hub (Nearby)',
        drop: order.address,
        payout: '₹120 Delivery Earning',
        status: 'Assigned'
      });
      localStorage.setItem('localmart_delivery_tasks', JSON.stringify(tasks));
      return order;
    },
    updateOrderStatus: function (orderId, newStatus) {
      const orders = this.getOrders();
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = newStatus;
        localStorage.setItem('localmart_orders', JSON.stringify(orders));
      }
      return order;
    },

    // Delivery Tasks
    getDeliveryTasks: function () {
      const data = localStorage.getItem('localmart_delivery_tasks');
      if (!data) {
        const seedTasks = [
          {
            id: 'LM-91823',
            item: 'Sony WH-1000XM4 Wireless Headphones',
            pickup: 'Indiranagar 100ft Rd',
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
      this.updateOrderStatus(taskId, 'Delivered');
    }
  };

  // --- 3. TOAST UTILITY ---
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

  // --- 4. PATH ROUTER HELPER ---
  function getPageUrl(targetPage) {
    const inPagesDir = window.location.pathname.includes('/src/pages/');
    return inPagesDir ? targetPage : `src/pages/${targetPage}`;
  }

  // --- 5. INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname.toLowerCase();

    // Theme setup
    const savedTheme = localStorage.getItem('localmart_theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
    }

    if (path.endsWith('login.html')) {
      init3WayLoginPage();
    } else if (path.endsWith('admin-dashboard.html')) {
      initMasterAdminDashboard();
    } else if (path.endsWith('home.html') || path.endsWith('index.html') || path === '/' || path.endsWith('/local%20mart/')) {
      initHomePage();
    } else if (path.endsWith('product-detail.html')) {
      initProductDetailPage();
    } else if (path.endsWith('sell.html')) {
      initSellPage();
    } else if (path.endsWith('checkout.html')) {
      initCheckoutPage();
    } else if (path.endsWith('order-success.html')) {
      initOrderSuccessPage();
    } else if (path.endsWith('delivery-dashboard.html')) {
      initDeliveryDashboard();
    } else if (path.endsWith('profile.html')) {
      initProfilePage();
    } else if (path.endsWith('settings.html')) {
      initSettingsPage();
    }
  });

  // --- 6. 3-WAY ROLE LOGIN ENGINE ---
  function init3WayLoginPage() {
    // Role selection tabs
    const roleTabs = document.querySelectorAll('.role-tab-btn');
    const customerPanel = document.getElementById('panel-customer');
    const partnerPanel = document.getElementById('panel-partner');
    const adminPanel = document.getElementById('panel-admin');

    if (roleTabs.length > 0) {
      roleTabs.forEach(tab => {
        tab.addEventListener('click', function () {
          roleTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const role = tab.getAttribute('data-role');
          if (customerPanel) customerPanel.style.display = role === 'customer' ? 'block' : 'none';
          if (partnerPanel) partnerPanel.style.display = role === 'partner' ? 'block' : 'none';
          if (adminPanel) adminPanel.style.display = role === 'admin' ? 'block' : 'none';
        });
      });
    }

    // Customer Login (One-click Google or Instant Customer Auth)
    const btnCustomerLogin = document.getElementById('btn-customer-login');
    if (btnCustomerLogin) {
      btnCustomerLogin.addEventListener('click', function () {
        localStorage.setItem('localmart_auth_role', 'customer');
        localStorage.setItem('localmart_auth_user', JSON.stringify({
          name: 'Verified Customer',
          email: 'neighbor@localmart.com',
          role: 'Customer (Buyer & Seller)'
        }));
        showToast('Welcome, Customer! Buy & Sell unlocked.', '🛒');
        setTimeout(() => {
          window.location.href = 'home.html';
        }, 600);
      });
    }

    // Delivery Partner Login
    const formPartner = document.getElementById('form-partner-login');
    if (formPartner) {
      formPartner.addEventListener('submit', function (e) {
        e.preventDefault();
        const phone = document.getElementById('partner-phone')?.value || '9876543210';
        localStorage.setItem('localmart_auth_role', 'partner');
        localStorage.setItem('localmart_auth_user', JSON.stringify({
          name: 'Local Delivery Rider',
          phone: phone,
          role: 'Delivery Partner'
        }));
        showToast('Delivery Partner Portal Opened!', '🛵');
        setTimeout(() => {
          window.location.href = 'delivery-dashboard.html';
        }, 600);
      });
    }

    // Admin & Staff Login (Checks Master Gudu7894 / Puthal@123 OR Employee Accounts)
    const formAdmin = document.getElementById('form-admin-login');
    if (formAdmin) {
      formAdmin.addEventListener('submit', function (e) {
        e.preventDefault();
        const enteredId = document.getElementById('admin-id')?.value.trim();
        const enteredPass = document.getElementById('admin-pass')?.value.trim();

        const masterAdmin = LocalMartDB.getAdminCreds();
        const employees = LocalMartDB.getEmployees();

        // 1. Check Master Admin Credentials
        if (enteredId === masterAdmin.username && enteredPass === masterAdmin.password) {
          localStorage.setItem('localmart_auth_role', 'super_admin');
          localStorage.setItem('localmart_auth_user', JSON.stringify({
            name: masterAdmin.name,
            username: masterAdmin.username,
            role: 'Super Admin (Full Master Control)'
          }));
          showToast('Master Admin Access Granted!', '🛡️');
          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 600);
          return;
        }

        // 2. Check Employee / Staff Accounts
        const matchedEmp = employees.find(emp => emp.id === enteredId && emp.pass === enteredPass);
        if (matchedEmp) {
          if (matchedEmp.status !== 'Active') {
            showToast('Account is deactivated. Contact Admin.', '⚠️');
            return;
          }
          localStorage.setItem('localmart_auth_role', 'employee');
          localStorage.setItem('localmart_auth_user', JSON.stringify({
            name: matchedEmp.name,
            username: matchedEmp.id,
            role: matchedEmp.role
          }));
          showToast(`Welcome ${matchedEmp.name} (${matchedEmp.role})!`, '💼');
          setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
          }, 600);
          return;
        }

        // Invalid Credentials Error
        showToast('Invalid ID or Password! Check credentials.', '❌');
      });
    }
  }

  // --- 7. MASTER ADMIN & EMPLOYEE CONTROL CENTER ---
  function initMasterAdminDashboard() {
    const authRole = localStorage.getItem('localmart_auth_role');
    const authUser = JSON.parse(localStorage.getItem('localmart_auth_user') || '{}');

    // Display current operator identity
    const badgeRole = document.getElementById('admin-current-role');
    if (badgeRole) {
      badgeRole.textContent = `${authUser.name || 'Admin'} (${authUser.role || 'Staff'})`;
    }

    renderAdminTabs();
    renderAdminProducts();
    renderAdminOrders();
    renderAdminEmployees();
    initAdminSettingsForm();
  }

  function renderAdminTabs() {
    const tabs = document.querySelectorAll('.admin-nav-pill');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-target');
        document.querySelectorAll('.admin-tab-content').forEach(c => {
          c.style.display = c.id === target ? 'block' : 'none';
        });
      });
    });
  }

  // Render & Manage Marketplace Listings
  function renderAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;

    const products = LocalMartDB.getProducts(true);
    if (products.length === 0) {
      container.innerHTML = '<p style="padding: 20px; color: var(--text-muted); text-align: center;">No listings found.</p>';
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="admin-item-card">
        <img src="${p.image}" alt="${p.title}" class="admin-thumb" onerror="this.src='https://placehold.co/100x100?text=Item'">
        <div class="admin-item-details">
          <div class="admin-item-title">${p.title}</div>
          <div class="admin-item-meta">₹${p.price.toLocaleString('en-IN')} • ${p.category} • Seller: ${p.seller}</div>
          <div style="margin-top: 4px;">
            <span class="status-pill ${p.status === 'Approved' ? 'status-approved' : 'status-pending'}">${p.status || 'Approved'}</span>
          </div>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn-action btn-approve" onclick="window.LocalMart.adminApproveProduct('${p.id}')">✓ Accept</button>
          <button type="button" class="btn-action btn-edit" onclick="window.LocalMart.adminEditProduct('${p.id}')">✏️ Edit</button>
          <button type="button" class="btn-action btn-delete" onclick="window.LocalMart.adminDeleteProduct('${p.id}')">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
  }

  // Render & Manage Orders
  function renderAdminOrders() {
    const container = document.getElementById('admin-orders-table-body');
    if (!container) return;

    const orders = LocalMartDB.getOrders();
    container.innerHTML = orders.map(o => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${o.title}</td>
        <td>₹${o.total.toLocaleString('en-IN')}</td>
        <td>${o.address}</td>
        <td><span class="status-pill status-approved">${o.status}</span></td>
        <td>
          <select onchange="window.LocalMart.adminChangeOrderStatus('${o.id}', this.value)" style="padding: 4px; font-size: 11px; border-radius: 4px;">
            <option value="Order Confirmed" ${o.status === 'Order Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  // Render & Manage Employees
  function renderAdminEmployees() {
    const container = document.getElementById('admin-employees-list');
    if (!container) return;

    const employees = LocalMartDB.getEmployees();
    container.innerHTML = employees.map(emp => `
      <div class="admin-item-card">
        <div style="width: 42px; height: 42px; border-radius: 50%; background: #2874f0; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700;">
          ${emp.name.charAt(0)}
        </div>
        <div class="admin-item-details">
          <div class="admin-item-title">${emp.name}</div>
          <div class="admin-item-meta">ID: <strong>${emp.id}</strong> | Role: ${emp.role}</div>
          <div style="font-size: 11px; color: var(--text-muted);">Pass: ${emp.pass} | Joined: ${emp.createdAt}</div>
        </div>
        <div class="admin-actions">
          <button type="button" class="btn-action btn-delete" onclick="window.LocalMart.adminRemoveEmployee('${emp.id}')">Remove</button>
        </div>
      </div>
    `).join('');
  }

  // Add Employee Form Handler
  const formAddEmployee = document.getElementById('form-add-employee');
  if (formAddEmployee) {
    formAddEmployee.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('new-emp-name').value.trim();
      const empId = document.getElementById('new-emp-id').value.trim();
      const password = document.getElementById('new-emp-pass').value.trim();
      const role = document.getElementById('new-emp-role').value;

      try {
        LocalMartDB.addEmployee(name, empId, password, role);
        showToast(`Employee ${name} created with ID: ${empId}!`, '🎉');
        formAddEmployee.reset();
        renderAdminEmployees();
      } catch (err) {
        showToast(err.message, '⚠️');
      }
    });
  }

  // Admin Change Credentials Form
  function initAdminSettingsForm() {
    const formCreds = document.getElementById('form-change-admin-creds');
    if (!formCreds) return;

    const currentCreds = LocalMartDB.getAdminCreds();
    const idInput = document.getElementById('change-admin-id');
    const passInput = document.getElementById('change-admin-pass');
    if (idInput) idInput.value = currentCreds.username;
    if (passInput) passInput.value = currentCreds.password;

    formCreds.addEventListener('submit', function (e) {
      e.preventDefault();
      const newId = idInput.value.trim();
      const newPass = passInput.value.trim();

      if (!newId || !newPass) {
        showToast('ID and Password cannot be empty', '⚠️');
        return;
      }

      LocalMartDB.updateAdminCreds(newId, newPass);
      showToast('Master Admin ID & Password Updated!', '🔑');
    });
  }

  // --- 8. HOME & CATALOGUE ENGINE ---
  function initHomePage() {
    const productGrid = document.querySelector('.product-grid');
    const searchInput = document.querySelector('input[type="search"]');
    const categorySlider = document.querySelector('.category-slider');
    const userLocationElem = document.getElementById('user-location');

    if (userLocationElem) {
      userLocationElem.style.cursor = 'pointer';
      userLocationElem.addEventListener('click', function () {
        userLocationElem.textContent = '📍 Deliver to: HSR Layout, Bengaluru (Verified)';
        showToast('Neighborhood Location Locked');
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
            <p style="font-size: 12px; margin-top: 4px;">Try searching for another keyword or post an item!</p>
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

    // Live search
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allProducts.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );
        renderProducts(filtered);
      });
    }

    // Category slider clicks
    if (categorySlider) {
      categorySlider.querySelectorAll('.slider-item').forEach(item => {
        item.addEventListener('click', function () {
          const catName = item.querySelector('span')?.textContent.trim() || '';
          if (catName && searchInput) {
            searchInput.value = catName;
            const filtered = allProducts.filter(p => p.category.toLowerCase() === catName.toLowerCase());
            renderProducts(filtered.length > 0 ? filtered : allProducts);
            showToast(`Filtered: ${catName}`);
          }
        });
      });
    }
  }

  // --- 9. PRODUCT DETAIL ENGINE ---
  function initProductDetailPage() {
    const products = LocalMartDB.getProducts(true);
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
            ✓ Price includes local doorstep home delivery
          </div>
          <div style="background: var(--bg-app); padding: 10px 12px; border-radius: 8px; font-size: 12px; color: var(--text-secondary); margin-bottom: 14px;">
            📍 <strong>Location:</strong> ${item.location || 'Within 2.5 km of your area'}<br>
            👤 <strong>Seller:</strong> ${item.seller || 'Verified Neighbor'}
          </div>
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

  // --- 10. SELL PAGE ENGINE ---
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
            showToast('Photo uploaded');
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
        location: 'Within 1.5 km',
        description: description,
        status: 'Approved'
      };

      LocalMartDB.addProduct(newProduct);
      showToast('Item posted live to Local Mart!', '🎉');
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    });
  }

  // --- 11. CHECKOUT ENGINE ---
  function initCheckoutPage() {
    const itemData = localStorage.getItem('localmart_checkout_item');
    const product = itemData ? JSON.parse(itemData) : LocalMartDB.getProducts()[0];

    const priceDisplay = document.querySelector('.bill-row span:last-child');
    const totalDisplay = document.querySelector('.bill-row.total strong:last-child');
    const bottomTotalDisplay = document.querySelector('.checkout-bottom-bar strong');

    if (product) {
      const total = product.price + 49;
      if (priceDisplay) priceDisplay.textContent = `₹${product.price.toLocaleString('en-IN')}`;
      if (totalDisplay) totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
      if (bottomTotalDisplay) bottomTotalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    const gpsBtn = document.querySelector('.btn-gps');
    const addressBox = document.querySelector('.address-box');
    if (gpsBtn && addressBox) {
      gpsBtn.addEventListener('click', function () {
        addressBox.innerHTML = `
          <strong>Verified GPS Location</strong><br>
          Flat 402, Green Glen Heights, Sector 4<br>
          HSR Layout, Bengaluru - 560102<br>
          Phone: +91 98765 43210
        `;
        showToast('GPS Locked');
      });
    }

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
        showToast('Order Placed!', '🚀');
        setTimeout(() => {
          window.location.href = 'order-success.html';
        }, 600);
      });
    }
  }

  // --- 12. ORDER SUCCESS ENGINE ---
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
        <h2 style="font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">Order Confirmed!</h2>
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
          Order ID: <strong>#${order.id}</strong><br>
          Your order for <strong>${order.title}</strong> is scheduled for home delivery.
        </p>
        <div style="background: var(--bg-app); border-radius: 10px; padding: 14px; text-align: left; font-size: 13px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Total Payable:</span> <strong>₹${order.total.toLocaleString('en-IN')}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>Delivery Agent:</span> <strong>${order.partner}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Live Status:</span> <strong style="color: #2874f0;">${order.status}</strong>
          </div>
        </div>
        <a href="home.html" style="text-decoration: none;">
          <button type="button" class="btn-buy" style="padding: 12px; font-size: 14px;">Back to Home</button>
        </a>
      </div>
    `;
  }

  // --- 13. DELIVERY DASHBOARD ENGINE ---
  function initDeliveryDashboard() {
    const tasksList = document.querySelector('main ul');
    const statusToggle = document.getElementById('status-toggle');

    if (statusToggle) {
      statusToggle.addEventListener('change', function () {
        showToast(statusToggle.checked ? 'Partner is Online' : 'Partner is Offline');
      });
    }

    function renderTasks() {
      const tasks = LocalMartDB.getDeliveryTasks();
      if (!tasksList) return;

      if (tasks.length === 0) {
        tasksList.innerHTML = '<li style="padding: 20px; text-align: center; color: var(--text-muted);">No new tasks assigned.</li>';
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
              ? '<span style="font-size: 12px; color: var(--success); font-weight: 700;">✓ Delivered</span>'
              : `<button type="button" class="btn-buy" onclick="window.LocalMart.completeDelivery('${task.id}')">Mark as Delivered</button>`
            }
          </div>
        </li>
      `).join('');
    }

    renderTasks();
  }

  // --- 14. PROFILE ENGINE ---
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

  // --- 15. SETTINGS ENGINE ---
  function initSettingsPage() {
    const darkToggle = document.getElementById('dark-toggle');
    if (darkToggle) {
      darkToggle.checked = localStorage.getItem('localmart_theme') === 'dark';
      darkToggle.addEventListener('change', function () {
        if (darkToggle.checked) {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.body.classList.add('dark-theme');
          localStorage.setItem('localmart_theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
          document.body.classList.remove('dark-theme');
          localStorage.setItem('localmart_theme', 'light');
        }
        showToast(darkToggle.checked ? 'Dark Mode On' : 'Light Mode On');
      });
    }
  }

  // --- 16. GLOBAL EXPOSURE & ADMIN ACTIONS ---
  window.LocalMart = {
    DB: LocalMartDB,

    startCheckout: function (productId) {
      const products = LocalMartDB.getProducts(true);
      const item = products.find(p => p.id === productId) || products[0];
      localStorage.setItem('localmart_checkout_item', JSON.stringify(item));
      localStorage.setItem('localmart_selected_product_id', productId);
      window.location.href = getPageUrl('checkout.html');
    },

    completeDelivery: function (taskId) {
      LocalMartDB.completeDeliveryTask(taskId);
      showToast('Delivery marked complete! Payout added.', '🎉');
      initDeliveryDashboard();
    },

    // Admin Product Management
    adminApproveProduct: function (id) {
      LocalMartDB.updateProduct(id, { status: 'Approved' });
      showToast('Listing Approved & Live!', '✓');
      renderAdminProducts();
    },
    adminEditProduct: function (id) {
      const products = LocalMartDB.getProducts(true);
      const item = products.find(p => p.id === id);
      if (!item) return;
      const newTitle = prompt('Edit Product Title:', item.title);
      if (newTitle === null) return;
      const newPrice = prompt('Edit Price (₹):', item.price);
      if (newPrice === null) return;

      LocalMartDB.updateProduct(id, {
        title: newTitle.trim() || item.title,
        price: parseFloat(newPrice) || item.price
      });
      showToast('Listing updated successfully!', '✏️');
      renderAdminProducts();
    },
    adminDeleteProduct: function (id) {
      if (confirm('Are you sure you want to delete this listing completely?')) {
        LocalMartDB.deleteProduct(id);
        showToast('Listing deleted', '🗑️');
        renderAdminProducts();
      }
    },

    // Admin Order Management
    adminChangeOrderStatus: function (orderId, newStatus) {
      LocalMartDB.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to: ${newStatus}`, '✓');
    },

    // Admin Employee Management
    adminRemoveEmployee: function (empId) {
      if (confirm(`Remove employee ID ${empId}?`)) {
        LocalMartDB.deleteEmployee(empId);
        showToast('Employee removed', '🗑️');
        renderAdminEmployees();
      }
    }
  };

})();
