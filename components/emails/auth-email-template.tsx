import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface AuthEmailTemplateProps {
  type: 'email-verification' | 'forgot-password' | 'magic-link';
  url: string;
  userName?: string;
}



export const AuthEmailTemplate = ({
  type,
  url,
  userName = 'User',
}: AuthEmailTemplateProps) => {
  const isVerification = type === 'email-verification';
  const isForgotPassword = type === 'forgot-password';

  const title = isVerification
    ? 'Verify your email address'
    : isForgotPassword
    ? 'Reset your password'
    : 'Sign in to Aesthetic AI';

  const buttonText = isVerification
    ? 'Verify Email'
    : isForgotPassword
    ? 'Reset Password'
    : 'Sign In';

  const description = isVerification
    ? `Welcome to Aesthetic AI! Please verify your email address to get started creating stunning AI-generated images.`
    : isForgotPassword
    ? `We received a request to reset your password. Click the button below to choose a new one.`
    : `Click the button below to securely sign in to your Aesthetic AI account.`;

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logoText}>Aesthetic AI</Heading>
          </Section>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>{description}</Text>
          <Section style={btnContainer}>
            <Button style={button} href={url}>
              {buttonText}
            </Button>
          </Section>
          <Text style={text}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Aesthetic AI • Modern Image Generation
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default AuthEmailTemplate;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const logoSection = {
  padding: '24px 0',
  textAlign: 'center' as const,
};

const logoText = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#000',
  letterSpacing: '-0.5px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
} as React.CSSProperties;

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
