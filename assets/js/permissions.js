class Permission{
    static permissionToUrl(){
        var urlRoles = {
            '/dashboard': ['staff', 'admin'],
            '/profile': ['staff', 'admin'],
            '/settings': ['admin'],
            '/admin': ['admin']
          };
        return urlRoles;
    }

      // Function to check if the user's role is allowed for a given URL
      static isRoleAllowed(url, role) {
        urlRoles = Permission.permissionToUrl();

        var allowedRoles = urlRoles[url];
        return allowedRoles && allowedRoles.includes(role);
      }
  
      // Function to restrict access to URLs based on user role
      static restrictAccessByRole(role) {
        var links = document.querySelectorAll('.sidebar-nav a');
        links.forEach(function(link) {
          var url = link.getAttribute('href');
          if (!Permission.isRoleAllowed(url, role)) {
            link.classList.add('disabled');
            link.onclick = function(event) {
              event.preventDefault();
              alert('Access denied. You do not have permission to access this URL.');
            };
          }
        });
      }
}