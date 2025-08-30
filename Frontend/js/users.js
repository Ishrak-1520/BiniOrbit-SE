// User interaction functionality for BiniOrbit
// Note: This requires backend endpoints for full functionality

const searchBar = document.querySelector(".search input"),
searchIcon = document.querySelector(".search button"),
usersList = document.querySelector(".users-list");

// Search functionality
if (searchIcon) {
  searchIcon.onclick = () => {
    searchBar.classList.toggle("show");
    searchBar.classList.toggle("active");
    searchBar.focus();
    if(searchBar.classList.contains("active")){
      searchBar.value = "";
      searchBar.classList.remove("active");
    }
  }
}

if (searchBar) {
  searchBar.onkeyup = () => {
    let searchTerm = searchBar.value;
    if(searchTerm != ""){
      searchBar.classList.add("active");
    } else {
      searchBar.classList.remove("active");
    }
    
    // Note: This requires a backend search endpoint
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "search.php", true);
    xhr.onload = () => {
      if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          let data = xhr.response;
          if (usersList) {
            usersList.innerHTML = data;
          }
        }
      }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("searchTerm=" + searchTerm);
  }
}

// Auto-refresh users list
if (usersList) {
  setInterval(() => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "users.php", true);
    xhr.onload = () => {
      if(xhr.readyState === XMLHttpRequest.DONE){
        if(xhr.status === 200){
          let data = xhr.response;
          if(!searchBar || !searchBar.classList.contains("active")){
            usersList.innerHTML = data;
          }
        }
      }
    }
    xhr.send();
  }, 500);
}

// Connection management
document.addEventListener('DOMContentLoaded', function() {
  // Add Connection
  document.querySelectorAll('.add-connection-btn').forEach(function(addBtn) {
    addBtn.addEventListener('click', function() {
      console.log('Add Connection clicked', this.getAttribute('data-email'));
      const email = this.getAttribute('data-email');
      fetch('add_connection.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'receiver_email=' + encodeURIComponent(email)
      }).then(r => r.json()).then(data => location.reload());
    });
  });
  
  // Accept Connection
  document.querySelectorAll('.accept-connection-btn, #accept-connection-btn').forEach(function(acceptBtn) {
    acceptBtn.addEventListener('click', function() {
      const email = this.getAttribute('data-email');
      fetch('accept_connection.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'sender_email=' + encodeURIComponent(email)
      }).then(r => r.json()).then(data => location.reload());
    });
  });
  
  // Remove Connection
  document.querySelectorAll('.remove-connection-btn, #remove-connection-btn').forEach(function(removeBtn) {
    removeBtn.addEventListener('click', function() {
      const email = this.getAttribute('data-email');
      fetch('remove_connection.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'sender_email=' + encodeURIComponent(email)
      }).then(r => r.json()).then(data => location.reload());
    });
  });
  
  // Disconnect
  document.querySelectorAll('.disconnect-btn, #disconnect-btn').forEach(function(disconnectBtn) {
    disconnectBtn.addEventListener('click', function() {
      const email = this.getAttribute('data-email');
      fetch('disconnect.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'other_email=' + encodeURIComponent(email)
      }).then(r => r.json()).then(data => location.reload());
    });
  });
  
  // Message functionality
  const messageBtn = document.getElementById('message-btn');
  if (messageBtn) {
    messageBtn.addEventListener('click', function() {
      const email = this.getAttribute('data-email');
      fetch('messenger_session.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'other_email=' + encodeURIComponent(email)
      }).then(r => r.json()).then(data => {
        if (data.status === 'not_logged_in') {
          window.location.href = 'messenger_login.php';
        } else if (data.status === 'ok' && data.chat_url) {
          window.location.href = data.chat_url;
        }
      });
    });
  }
});

// Notification functions
function loadNotifications() {
  fetch('get_notifications.php')
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('notificationsList');
      if (!list) return;
      
      if (data.success) {
        if (data.notifications.length === 0) {
          list.innerHTML = '<div class="loading">No notifications yet.</div>';
          const badge = document.getElementById('notificationBadge');
          if (badge) badge.style.display = 'none';
        } else {
          let unreadCount = 0;
          list.innerHTML = data.notifications.map(notif => {
            if (notif.is_read == 0) unreadCount++;
            return `<div class="notification-item${notif.is_read == 0 ? ' unread' : ''}" data-id="${notif.id}" data-type="${notif.type}" data-info='${JSON.stringify(notif.data)}'>
              <span class="notif-icon">${getNotifIcon(notif.type)}</span>
              <span>${getNotifText(notif)}</span>
              <span class="notif-time">${timeAgo(notif.created_at)}</span>
            </div>`;
          }).join('');
          
          const badge = document.getElementById('notificationBadge');
          if (badge) {
            if (unreadCount > 0) { 
              badge.textContent = unreadCount; 
              badge.style.display = 'flex'; 
            } else { 
              badge.style.display = 'none'; 
            }
          }
          
          // Add click handlers
          document.querySelectorAll('.notification-item').forEach(item => {
            item.onclick = function() {
              const notifId = this.getAttribute('data-id');
              const notifType = this.getAttribute('data-type');
              const notifData = JSON.parse(this.getAttribute('data-info') || '{}');
              
              // Mark as read
              fetch('mark_notifications_read.php', { 
                method: 'POST', 
                body: `id=${notifId}`, 
                headers: {'Content-Type': 'application/x-www-form-urlencoded'} 
              });
              
              // Handle navigation based on notification type
              handleNotificationClick(notifType, notifData);
            };
          });
        }
      } else { 
        list.innerHTML = '<div class="loading">Failed to load notifications.</div>'; 
      }
    })
    .catch(() => { 
      const list = document.getElementById('notificationsList');
      if (list) {
        list.innerHTML = '<div class="loading">Error loading notifications.</div>'; 
      }
    });
}

function handleNotificationClick(notifType, notifData) {
  switch(notifType) {
    case 'like':
    case 'comment':
      if (notifData.post_id) {
        window.location.href = `newsfeed.php?post_id=${notifData.post_id}${notifType === 'comment' ? '#comments' : ''}`;
      } else {
        window.location.href = 'newsfeed.php';
      }
      break;
      
    case 'connection_request':
      window.location.href = 'Connections.php';
      break;
      
    case 'connection_accepted':
      if (notifData.receiver_email) {
        window.location.href = `ProfileVisit.php?user_email=${encodeURIComponent(notifData.receiver_email)}`;
      } else {
        window.location.href = 'Connections.php';
      }
      break;
      
    case 'investment_accepted':
      // Check if logged in to messenger
      if (sessionStorage.getItem('messenger_logged_in')) {
        window.location.href = 'ChatroomInbox.php';
      } else {
        window.location.href = 'messenger_login.php';
      }
      break;
      
    default:
      window.location.href = 'newsfeed.php';
  }
}

function getNotifIcon(type) {
  switch(type) {
    case 'like': return "<i class='bx bx-like'></i>";
    case 'comment': return "<i class='bx bx-comment'></i>";
    case 'share': return "<i class='bx bx-share'></i>";
    case 'investment_request': return "<i class='bx bx-dollar-circle'></i>";
    case 'investment_accepted': return "<i class='bx bx-check-circle'></i>";
    case 'connection_request': return "<i class='bx bx-user-plus'></i>";
    case 'connection_accepted': return "<i class='bx bx-link'></i>";
    default: return "<i class='bx bx-bell'></i>";
  }
}

function getNotifText(notif) {
  const data = notif.data || {};
  switch(notif.type) {
    case 'like':
      return `${data.liker_name || 'Someone'} liked your post.`;
    case 'comment':
      return `${data.commenter_name || 'Someone'} commented on your post.`;
    case 'connection_request':
      return `${data.sender_name || 'Someone'} sent you a connection request.`;
    case 'connection_accepted':
      return `${data.receiver_name || 'Someone'} accepted your connection request.`;
    case 'investment_accepted':
      return `${data.business_name || 'A business'} accepted your investment request.`;
    default:
      return notif.message || 'You have a new notification.';
  }
}

function timeAgo(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = { 
    year: 31536000, 
    month: 2592000, 
    week: 604800, 
    day: 86400, 
    hour: 3600, 
    minute: 60 
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) { 
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`; 
    }
  }
  return 'Just now';
}