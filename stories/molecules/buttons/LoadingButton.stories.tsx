/* eslint-disable import/no-anonymous-default-export */
import { Title } from "@storybook/addon-docs"
import { ComponentStory } from "@storybook/react"
import { Image, Stack } from "components/bootstrap"
import { LoadingButton } from "components/buttons"
import { useState } from "react"
import { createMeta } from "stories/utils"

export default createMeta({
  title: "Molecules/Buttons/LoadingButton",
  component: LoadingButton,
  parameters: {
    docs: {
      page: () => (
        <Stack gap={2} className="col-4">
          <Title>Loading Buttons</Title>
          <Primary {...Primary.args} />
          <Disabled {...Disabled.args} />
          <Loading {...Loading.args} />
          <Light {...Light.args} />
          <WithImage {...WithImage.args} />
        </Stack>
      )
    }
  }
})

const Template: ComponentStory<typeof LoadingButton> = ({
  children,
  disabled = false,
  loading = false,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(loading)
  const clickAction = () => {
    setLoading(true)
    return setTimeout(() => setLoading(false), 2000)
  }
  return (
    <LoadingButton
      loading={isLoading}
      onClick={clickAction}
      disabled={disabled}
      {...rest}
    >
      {children}
    </LoadingButton>
  )
}

export const Primary = Template.bind({})
Primary.args = {
  children: "Click Me!"
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  children: "Disabled"
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  children: "Loading"
}

export const Light = Template.bind({})
Light.args = {
  variant: "light",
  children: "Light"
}

export const WithImage = Template.bind({})
WithImage.args = {
  variant: "light",
  spinnerProps: { className: "me-4" },
  children: (
    <>
      <Image src="/google-icon.svg" alt="Google" className="me-4" />
      With Image
    </>
  )
}

// export const LightWithImage = () => (
//   <LoadingButton variant="light" spinnerProps={}>
//
//     Loading Button
//   </LoadingButton>
// )
