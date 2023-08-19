# n-route <!-- omit from toc -->

[![npm version][npm-version-src]][npm-version-href]
[![Github Actions][github-actions-src]][github-actions-href]

> Enabling flat routes for Next.js

## Table of Contents <!-- omit from toc -->

- [Introduction](#introduction)
- [Usage](#usage)
- [About flat routes](#about-flat-routes)
- [Index route files](#index-route-files)
- [Supported file extensions](#supported-file-extensions)
- [License](#license)

---

## Introduction

With the introduction of [Next.js 13][nextjs], a new folder-based routing mechanism was unveiled. While this approach offers powerful and flexible routing capabilities, it brings with it the challenge of managing deeply nested route files. In large projects with a myriad of routes, locating a specific route or deciphering the intricate structure of the application becomes increasingly complex.

Enter `n-route`.

Designed specifically for Next.js 13, `n-route` is a CLI tool that allows developers to work with a flat route file structure that is easier to manage and understand. With `n-route` your routes can be structured like this:

```
app/
|-- shop/
    |-- routes/
        |-- basket.(page).tsx
        |-- product.(page).tsx
        |-- product.[id].(page).tsx

```

... and `n-route` will ensure that these routes are transformed into the nested format that Next.js expects.

```
app/
|-- shop/
    |-- (.routes)/
    |   |-- basket/
    |   |   |-- page.tsx
    |   |-- product/
    |       |-- page.tsx
    |       |-- [id]/
    |           |-- page.tsx
    |-- routes/
        |-- basket.(page).tsx
        |-- product.(page).tsx
        |-- product.[id].(page).tsx

```

## Usage

To start using the `n-route`, run the following command in the Next.js project root:

```sh
npx n-route@latest
```

This will initiate `n-route` in watch mode.

Then add flat route files within any `/routes/` folder located within the `app` directory. As you add, rename, or remove these flat route files, the equivalent nested route file will be generated or updated within a parallel `/(.routes)/` directory.

> Note: The `/(.routes)/` directory should be considered as "private", similar to the `.next` directory that Next.js uses for its build output. Files within this directory are auto-generated and should not be manually edited.

## About flat routes

Flat routes can be created for `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` and `route.tsx` files. All that is required is for their flat route equivalent filenames to end with `.(page).tsx`, `.(layout).tsx`, `.(loading).tsx`, `.(error).tsx` and `.(route).tsx` .

Example:

```
/app/shop/routes/basket.(page).tsx
/app/shop/routes/product.(layout).tsx
/app/shop/routes/product.[productId].(page).tsx
/app/admin/routes/settings.(page).tsx
```

Additionally, each route segment should be delimited by a period (.), as seen in the example above.

## Index route files

For flat index route files, there's no need to prefix the route filename. For instance, the admin homepage will be:

```
/app/admin/(page).tsx
/app/admin/(error).tsx
/app/admin/(layout).tsx
/app/admin/(loading).tsx
```

## Supported file extensions

`n-route` supports `.ts`, `.tsx`, `.jsx`, and `.js` file extensions for flat route files.

## License

[MIT](./LICENSE)

<!-- Reference links -->

[npm-version-src]: https://img.shields.io/npm/v/n-route?style=flat-square
[npm-version-href]: https://npmjs.com/package/n-route
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/ifyio/n-route/ci.yml?style=flat-square
[github-actions-href]: https://github.com/ifyio/n-route/actions?query=workflow%3Aci
[nextjs]: https://nextjs.org
