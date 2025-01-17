<div class="aside aside__no-top">

This recipe assumes that you have a React app using Tailwind CSS and have just set up Storybook >=6.0 using the [getting started guide](/docs/react/get-started/install). Don’t have this? Follow Tailwind's [setup instructions](https://tailwindcss.com/docs/installation) then run:

```shell
# Add Storybook:
npx sb init
```

</div>

<RecipeHeader>

How to setup Tailwind CSS and Storybook

</RecipeHeader>

Storybook.js is a fantastic tool for developing and showcasing UI components in isolation. One of the great things about it is that you can use any CSS framework you like, including Tailwind CSS.

In this post, we will:

1. 🏗️ Build Tailwind next to Storybook
2. 🎁 Provide Tailwind to stories
3. 🧱 Use Tailwind in your components
4. 🎨 Switch Tailwind themes in a click

![Finished example of Tailwind CSS in Storybook with a theme switcher](https://user-images.githubusercontent.com/18172605/208201389-1f448dbb-978c-442e-9d6b-7bf3fea63e64.gif)

## Build Tailwind next to Storybook

<div class="aside aside__no-top">

As of storybook 7, as long as your project is already configured to use postCSS, you can skip this step.

</div>

To develop with Tailwind alongside your stories, storybook will need to know how to handle Tailwind's custom `@tailwind` css directive. We can do this with PostCSS.

First of all, install a few extra dependencies.

```shell
yarn add -D postcss autoprefixer postcss-loader
```

Now create a `postcss.config.js` file in the root of your project.

```js
// postcss.config.js

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Then add the `postcss-loader` to storybook using the `webpackFinal` option your `.storybook/main.js` file.

```diff
module.exports = {
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions"
  ],

  // Snipped for brevity

+ webpackFinal: async (config) => {
+   config.module.rules.push({
+     test: /\.css$/i,
+     use: [
+       {
+         loader: "postcss-loader",
+         options: { implementation: require.resolve("postcss") },
+       },
+     ],
+     include: path.resolve(__dirname, "../"),
+   });
+   // Return the altered config
+   return config;
+ },
}
```

## Provide Tailwind to stories

Now you can import the `tailwind.css` file into your `.storybook/preview.js` file. This will make Tailwind’s style classes available to all of your stories.

```js
// .storybook/preview.js

import '../src/tailwind.js'; // replace with the name of your tailwind css file
```

## Use Tailwind in components

Let’s update some of our example components to use Tailwind instead. Open up Storybook to see what we have so far.

![Storybook before adding tailwind CSS to the example components](https://user-images.githubusercontent.com/18172605/208201413-ace25d53-880a-4580-a81a-3d628fba229e.gif)

To make use of Tailwind, replace the contents of each component file with the following code:

<!-- prettier-ignore-start -->

<CodeSnippets
    paths={[
        'tailwindcss/Button.js.mdx',
        'tailwindcss/Header.js.mdx',
        'tailwindcss/Page.js.mdx',
    ]}
/>

<!-- prettier-ignore-end -->

![Storybook after adding tailwind CSS to the example components](https://user-images.githubusercontent.com/18172605/208201423-c7ea9392-1851-4fc3-9968-6d05399c2e91.gif)

## Add a theme switcher tool using `globalTypes`

Tailwind comes out of the box with a light and dark theme. You can override those themes and add more. To get the most out of your stories, you should have a way to toggle between all of your themes.

![Finished example of Tailwind CSS in Storybook with a theme switcher](https://user-images.githubusercontent.com/18172605/208201389-1f448dbb-978c-442e-9d6b-7bf3fea63e64.gif)

First of all, update your `tailwind.config.js` file to [change themes based on a class or data-attribute](https://tailwindcss.com/docs/dark-mode#customizing-the-class-name). This example uses a data-attribute.

```js
// tailwind.config.js

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Toggle dark-mode based on data-mode="dark"
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

To add the switcher, declare a [global type](/docs/react/essentials/toolbars-and-globals) named "theme" in `.storybook/preview.js` and give it a list of supported themes to choose from.

```js
// .storybook/preview.js
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    toolbar: {
      icon: 'paintbrush',
      // Array of plain string values or MenuItem shape
      items: [
        { value: 'light', title: 'Light', left: '🌞' },
        { value: 'dark', title: 'Dark', left: '🌛' },
      ],
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};
```

This code will create a new toolbar menu to select your desired theme for your stories.

### Add a `withTailwindTheme` decorator

There needs to be a way to tell Tailwind to use the theme that is selected in the toolbar. To do that, This can be done using a [decorator](/docs/vue/writing-stories/decorators).

Below I created a new file in `.storybook` called `withTailwindTheme.decorator.js` that will take the global theme value and update the current theme.

```js
// .storybook/withTailwindTheme.decorator.js

import { useEffect } from 'react';

export const DEFAULT_THEME = 'light';

export const withTailwindTheme = (Story, context) => {
  const { theme } = context.globals;

  useEffect(() => {
    const htmlTag = document.documentElement;

    // Set the "data-mode" attribute on the iFrame html tag
    htmlTag.setAttribute('data-mode', theme || DEFAULT_THEME);
  }, [theme]);

  return <Story />;
};
```

Now all we have to do is give this decorator to Storybook to wrap our stories in. Add the decorator to the `decorators` array in `.storybook/preview.js`:

```js
import { DEFAULT_THEME, withTailwindTheme } from './withTailwindTheme.decorator';

/* snipped for brevity */

export const decorators = [withTailwindTheme];
```

## Get involved

Now you're ready to use Tailwind with Storybook. 🎉 Check out the [example repo](https://github.com/Integrayshaun/storybook-tailwind-recipe-example) for a quick start.

If you use Tailwind at work, we'd love your help making an addon that automatically applies the configuration above. Join the maintainers in [Discord](https://discord.gg/storybook) to get involved, or jump into [addon docs](/docs/react/addons/introduction).
