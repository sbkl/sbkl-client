# sbkl-components

A Set a personal vue components.

## Admin panel

### Installation

1- Create a Nuxt project

```bash
npx create-nuxt-app [project-name]
//Package manager: Yarn
//UI Framework: None
//custom server framework: None
//Nuxt.js Modules: Axios, DotEnv
//linting tools: None at the moment
//test framework: None at the moment
//rendering mode: Universal
//development tools: jsconfig.json (Recommended for VS Code)
```

2- cd into your project folder

```bash
cd [project-name]
```

3- Install the package via yarn or npm:

```bash
yarn add -D node-sass sass-loader tailwindcss @tailwindcss/ui nuxt-purgecss
yarn add sbkl-components portal-vue @popperjs/core @nuxtjs/auth
```

`@nuxtjs/dotenv @nuxtjs/axios` are already installed via `create-nuxt-app`.

2- Copy the template files:

```bash
cp ./node_modules/sbkl-components/templates/config/nuxt.config.js .
cp ./node_modules/sbkl-components/templates/config/admin.config.js .
cp ./node_modules/sbkl-components/templates/config/tailwind.config.js .
cp ./node_modules/sbkl-components/templates/plugins/global.js ./plugins/global.js
cp ./node_modules/sbkl-components/templates/plugins/sbkl-components.js ./plugins/
mkdir ./plugins/mixins && cp ./node_modules/sbkl-components/templates/plugins/mixins/responsive.js ./plugins/mixins/
cp ./node_modules/sbkl-components/templates/store/admin.js ./store/
cp ./node_modules/sbkl-components/templates/store/validation.js ./store/
cp ./node_modules/sbkl-components/templates/store/index.js ./store/index.js
mkdir ./assets/sass && cp ./node_modules/sbkl-components/templates/assets/sass/tailwind.sass ./assets/sass/
mkdir ./assets/img && cp ./node_modules/sbkl-components/templates/assets/img/rstore_icon_gray_bg.png ./assets/img/
cp ./node_modules/sbkl-components/templates/layouts/admin.vue ./layouts/
cp ./node_modules/sbkl-components/templates/layouts/default.vue ./layouts/
cp ./node_modules/sbkl-components/templates/layouts/none.vue ./layouts/
cp ./node_modules/sbkl-components/templates/middleware/authenticated.js ./middleware/
cp ./node_modules/sbkl-components/templates/middleware/authNotConfirmed.js ./middleware/
cp ./node_modules/sbkl-components/templates/middleware/guest.js ./middleware/
cp ./node_modules/sbkl-components/templates/pages/privacy.vue ./pages/
cp ./node_modules/sbkl-components/templates/pages/support.vue ./pages/
cp ./node_modules/sbkl-components/templates/pages/index.vue ./pages/
cp ./node_modules/sbkl-components/templates/.env.example ./.env
cp ./node_modules/sbkl-components/templates/static/favicon.ico ./static/
rm ./assets/README.md
rm ./components/README.md
rm ./layouts/README.md
rm ./middleware/README.md
rm ./pages/README.md
rm ./plugins/README.md
rm ./static/README.md
rm ./store/README.md
```

3- Setup parameters

in .env: change APP_NAME, URL, and PASSPORT_SECRET. PASSPORT_CLIENT_ID is 2 by default.

4- Launch App

As soon as the api is ready, you can start launching the app:

```
yarn dev
```

### Usage

Below is the admin.config.js file provided at the route of the project copied in the step 2 of the installation process:

```javascript
const tables = {};

const customRoutes = Object.keys(tables);

const adminPanelPath =
  "./node_modules/sbkl-components/components/AdminPanel.vue";

export { customRoutes, tables, adminPanelPath };
```

Now, inside the tables Object, we can create our first table

```javascript
const tables = {
  "admin-regions": {
    name: "regions",
    attributes: [["id"], ["name", "w-64"], ["created_at:created"]],
    form: [["name"]],
    actions: [["v-update-button"], ["v-delete-button"]]
  }
};
```

- "admin-regions" will define the route "admin/regions" in our projects.
- name is the name of the table defined.
- attributes will be used to build the table UI.
- form will be used to build the form for creation/update/deletion
- actions will insert vue components to perform actions available out of the box with the plugin (update, delete, activation, relationships). Note create is included by default at the top of table for any table and doesnt need to be added to the actions - array.

#### routes

```javascript
this.$axios.$get("admin/panel"); // Fetch all models (see details below)
this.$axios.$post("admin/regions"); // Create a new region with parameters from the form defined in the admin.config.js file
this.$axios.$patch("admin/regions/regionId"); // Update a given region with parameters from the form defined in the admin.config.js file
this.$axios.$delete("admin/regions/regionId"); // Update a given region with parameters from the form defined in the admin.config.js file
```

The POST, PATCH and DELETE route are dynamic and accessible by any table created inside the admin.config.js file.

#### Back end

Now that our config is done on the front end, we need to prepare the back-end.

The plugin will make a get request to the route "admin/panel" in order to fetch the tables defined in the admin.config.js. It is expecting a return a JSON object with the name of the tables as keys and an array of items related as values.

Example with Laravel PHP:

In my api routes file:

```php
Route::get('/admin/panel', 'Admin\PanelController@index');
Route::post('/admin/regions', 'Admin\RegionController@store');
Route::patch('/admin/regions/{region}', 'Admin\RegionController@update');
Route::delete('/admin/regions/{region}', 'Admin\RegionController@destroy');
```

In my PanelController:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Region;
use App\Http\Controllers\Controller;

class PanelController extends Controller
{
    public function index()
    {
        return [
            'regions' => Region::all(),
            // add other models here
        ];
    }
}
```

This controller will be exclusively in charge to return any tables requested by the admin.config.js file.

In My RegionController:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Region;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RegionController extends Controller
{
    public function store()
    {
      request()->validate([
          'name' => 'required|unique:regions,name'
      ]);
      Region::create([
          'name' => request('name')
      ]);
    }
    public function update(Region $region)
    {
      request()->validate([
          'name' => "required|unique:regions,name,{$region->id}"
      ]);
      $region->update([
          'name' => request('name')
      ]);
    }
    public function destroy(Region $region)
    {
        $region->delete();
    }
}
```
