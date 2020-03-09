export default (url) => {
  return {
    redirect: {
      login: "/auth/login",
      home: false,
      logout: "/auth/login"
    },
    strategies: {
      local: false,
      "laravel.passport": {
        _scheme: "local",
        endpoints: {
          login: {
            url: url + "/oauth/token",
            method: "post",
            propertyName: "access_token"
          },
          logout: {
            url: url + "/api/user/logout",
            method: "get"
          },
          user: {
            url: url + "/api/user",
            method: "get",
            propertyName: "data"
          }
        }
      }
    }
  };
}