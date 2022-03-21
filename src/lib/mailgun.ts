// need domain
// need api key
// need whether using us or EU infra

// Base url https://api.mailgun.net
// create message v3/<domain>/messages
//
// vars to set
// from
// to
// subject
// text
// html
type EmailParams = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  domain: string;
};
export const sendMessage = async (emailParams: EmailParams) => {
  const sent = await fetch(
    `htps://api.mailgun.net/v3/${emailParams.domain}/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        from: emailParams.from,
        to: emailParams.to,
        subject: emailParams.subject,
        text: emailParams.text,
        html: emailParams.html,
      }),
    }
  );
  console.log(sent);
  debugger;
};
