import { within, userEvent } from '@storybook/testing-library'

MyStory.play = (context) => {
  const canvas = within(context.canvasElement)
  // not awaited!
  userEvent.click(canvas.getByRole('button'))
}
