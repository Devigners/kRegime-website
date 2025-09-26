import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailLayoutProps {
  preview?: string;
  children: React.ReactNode;
}

export function BaseEmailLayout({
  preview = 'Thank you for choosing kRegime - Your Korean skincare journey awaits!',
  children,
}: BaseEmailLayoutProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .mobile-margin { margin: 16px 0px !important; }
            .mobile-padding { padding: 16px !important; }
            .mobile-text-sm { font-size: 14px !important; }
            .mobile-text-base { font-size: 16px !important; }
            .mobile-text-lg { font-size: 18px !important; }
            .mobile-text-xl { font-size: 20px !important; }
            .mobile-text-2xl { font-size: 24px !important; }
            .mobile-full-width { width: 100% !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-center { text-align: center !important; }
            .mobile-mb-4 { margin-bottom: 16px !important; }
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#ef7e71',
                'primary-dark': '#e66b5d',
                'primary-light': '#f29287',
                secondary: '#d4654f',
                'secondary-dark': '#b8543c',
                accent: '#ffe066',
                neutral: {
                  50: '#fafafa',
                  100: '#f5f5f5',
                  200: '#eeeeee',
                  300: '#e0e0e0',
                  800: '#424242',
                  900: '#212121',
                },
              },
              fontFamily: {
                sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="bg-neutral-50 font-sans">
          <Container 
            className="mx-auto py-5 pb-12"
            style={{ maxWidth: '600px', width: '100%' }}
          >
            {/* Header */}
            <Section className="mt-8">
              <div className="text-center mobile-padding">
                <Img
                  src="https://sandbox.kregime.com/logo.svg"
                  width="80"
                  height="80"
                  alt="kRegime"
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    maxWidth: '80px',
                    height: 'auto',
                  }}
                />
                <Text className="text-sm text-neutral-600 mt-0 mobile-text-sm">
                  Your personalized Korean skincare journey
                </Text>
              </div>
            </Section>

            {/* Content */}
            <Section className="mt-8 mx-6 mobile-margin mobile-padding">
              <div 
                className="bg-white rounded-lg border border-neutral-200 shadow-lg p-8 mobile-padding"
                style={{ padding: '32px' }}
              >
                {children}
              </div>
            </Section>

            {/* Footer */}
            <Section className="mt-8 mx-6 mobile-margin mobile-padding">
              <div className="text-center border-t border-neutral-200 pt-8">
                <Text className="text-xs text-neutral-500 mb-4 mobile-text-sm">
                  kRegime - Personalized Korean Skincare Regimens
                </Text>
                <Text className="text-xs text-neutral-500 mb-2 mobile-text-sm">
                  Follow us for skincare tips and updates:
                </Text>
                <div className="text-center mb-4">
                  <Link
                    href="#"
                    className="text-primary text-xs mr-4 mobile-text-sm"
                    style={{ 
                      color: '#ef7e71', 
                      textDecoration: 'none',
                      marginRight: '16px',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    Instagram
                  </Link>
                  <Link
                    href="#"
                    className="text-primary text-xs mr-4 mobile-text-sm"
                    style={{ 
                      color: '#ef7e71', 
                      textDecoration: 'none',
                      marginRight: '16px',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    TikTok
                  </Link>
                  <Link
                    href="#"
                    className="text-primary text-xs mobile-text-sm"
                    style={{ 
                      color: '#ef7e71', 
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    Website
                  </Link>
                </div>
                <Text className="text-xs text-neutral-400 mobile-text-sm">
                  © {new Date().getFullYear()} kRegime. All rights reserved.
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}