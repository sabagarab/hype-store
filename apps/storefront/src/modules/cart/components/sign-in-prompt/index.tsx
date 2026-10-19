import { buttonClass } from "@modules/common/components/button"
import { Heading, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-black flex items-center justify-between">
      <div>
        <Heading level="h2" className="text-xl">
          Already have an account?
        </Heading>
        <Text className="text-sm text-bone/70 mt-2">
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
