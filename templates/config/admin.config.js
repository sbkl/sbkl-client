const tables = {
  "admin-regions": {
    name: "regions",
    attributes: [
      ["name", "w-48"],
      ["market_count", "w-32 text-center"],
      ["store_count", "w-32 text-center"],
      ["created_at:created"],
    ],
    form: [["name"]],
    actions: [["v-update-button"], ["v-delete-button"]],
  },
  "admin-markets": {
    name: "markets",
    attributes: [
      ["name|region.name:location", "w-48", "-"],
      ["store_count", "w-48 text-center"],
      ["created_at:created"],
    ],
    form: [["name"], ["region", "dropdown", "regions:name"]],
    actions: [["v-update-button"], ["v-delete-button"]],
  },
  "admin-stores": {
    name: "stores",
    attributes: [
      ["id,name|market.region.name,market.name:name", "w-64", "-"],
      ["channel"],
      ["created_at:created"],
    ],
    form: [
      ["id", "text", null, null, true],
      ["name"],
      ["market", "dropdown", "markets:name", null, true],
      ["channel", "dropdown", ["Mainline", "Outlet"], null, true],
    ],
    actions: [
      ["v-update-button"],
      ["v-activation-button"],
      ["v-delete-button"],
      ["v-relationship-button"],
    ],
  },
  "admin-users": {
    name: "users",
    modalContainerStyle: "w-1/2",
    attributes: [
      ["first_name,last_name|role,email:name", "w-72", "-"],
      ["plant_id|plant.name:plant", "w-48"],
      ["lang", "w-24"],
      ["created_at_diff_for_humans:created"],
      ["last_activity_at_diff_for_humans:last_activity"],
    ],
    form: [
      [[["first_name"], ["last_name"], ["email", "email"]]],
      [
        [
          ["role", "dropdown", "roles:name", "name"],
          ["lang", "dropdown", ["en", "zh-HK", "zh-CN"]],
          ["plant", "dropdown", "plants:name", "plant"],
        ],
      ],
    ],
    actions: [["v-update-button"], ["v-activation-button"]],
  },
};
const redirectRoutes = {
  Admin: {
    name: "admin-regions",
    path: "/admin/regions",
  },
  default: {
    name: "/",
    path: "/",
  },
};

export { tables, redirectRoutes, logo };
