export function InviteEmailTemplate({ senderName, listName, inviteUrl }: { senderName: string, listName: string, inviteUrl: string }) {
    return (
        <div>
            <h1>{senderName} shared a list</h1>
            <p>{senderName} has invited you to collaborrate on the following list <br />{listName}</p>
            <a href={inviteUrl}>Accept Invite</a>
        </div>
    )
}
