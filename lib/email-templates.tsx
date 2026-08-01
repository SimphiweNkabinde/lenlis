import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from 'react-email';

interface LenlisInviteEmailProps { senderName: string, listName: string, inviteUrl: string }

export function InviteEmailTemplate({ senderName, listName, inviteUrl }: LenlisInviteEmailProps) {
    return (
        <Html>
            <Head />
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Preview>Join the shared list</Preview>
                    <Container className="mx-auto my-0 max-w-[560px] px-0 pt-5 pb-12">
                        <Img
                            src="https://raw.githubusercontent.com/SimphiweNkabinde/lenlis/refs/heads/main/public/lenlis-logo.png"
                            width="42"
                            height="42"
                            alt="Lenlis"
                            className="rounded-3xl w-[42px] h-[42px]"
                        />
                        <Heading className="text-[24px] tracking-[-0.5px] leading-[1.3] text-[#484848] pt-[17px] px-0 pb-0">
                            Join the shared list
                        </Heading>
                        <Text className="mb-[15px] mx-0 mt-0 leading-[1.4] text-[15px] text-[#3c4149]">
                            Hi, <strong>{senderName}</strong> wants to collaborate with you on the <strong>{listName}</strong> list on <strong>Lenlis</strong>. Click the button below to join and start adding items.                 </Text>
                        <Section className="mt-[32px] mb-[32px] text-center">
                            <Button
                                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                                href={inviteUrl}
                            >
                                Join the list
                            </Button>
                        </Section>
                        <Text className="mb-[15px] mx-0 mt-0 leading-[1.4] text-[15px] text-[#3c4149]">
                            If the button does not work, copy and paste this link into your browser: <br />
                            <Link href={inviteUrl} className="text-blue-600 no-underline">
                                {inviteUrl}
                            </Link>
                            <br />  If you did not expect this invitation, you can ignore this email.
                        </Text>
                        <Hr className="border-[#dfe1e4] mt-[42px] mb-[26px]" />
                        <Link
                            href="https://lenslis.com"
                            className="text-[#b4becc] text-[14px]"
                        >
                            Lenlis
                        </Link>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

