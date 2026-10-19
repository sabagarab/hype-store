import { buttonClass } from "@modules/common/components/button"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-ui-bg-base flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Already have an account?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Sign in for a better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink
          href="/account"
          className={buttonClass({ variant: "secondary", size: "sm" })}
          data-testid="sign-in-button"
        >
          Sign in
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
