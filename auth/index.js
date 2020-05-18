export default (url, clientId, redirectUri) => {
  return {
    redirect: {
      login: "/auth/login",
      home: false,
      logout: "/auth/login",
    },
    strategies: {
      local: false,
      "laravel.passport": {
        _scheme: "local",
        endpoints: {
          login: {
            url: url + "/oauth/token",
            method: "post",
            propertyName: "access_token",
          },
          logout: {
            url: url + "/api/user/logout",
            method: "get",
          },
          user: {
            url: url + "/api/user",
            method: "get",
            propertyName: "data",
          },
        },
      },

      "laravel.tokenExchange": {
        _scheme: "local",
        endpoints: {
          login: {
            url: url + "/api/auth/callback",
            method: "post",
            propertyName: "access_token",
          },
          user: {
            url: "user",
            method: "get",
            propertyName: "data",
          },
        },
      },

      pingOne: {
        _scheme: "oauth2",
        authorization_endpoint:
          "https://sso.connect.pingidentity.com/sso/as/authorization.oauth2",
        userinfo_endpoint: false,
        scope: ["openid"],
        response_type: "token id_token",
        token_type: "Bearer",
        redirect_uri: redirectUri,
        client_id: clientId,
        token_key: "access_token",
        state: "UNIQUE_AND_NON_GUESSABLE",
      },
    },
  };
};
