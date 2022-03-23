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
export type EmailParams = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  domain: string;
  html: string;
  apiKey: string;
};
export const sendMessage = async (emailParams: EmailParams) => {
  console.log(emailParams);
  const recipientVars = emailParams.to.reduce(
    (prev, val) => ({ ...prev, [val]: {} }),
    {}
  );
  const formData = new FormData();
  formData.append("from", emailParams.from);
  formData.append("to", emailParams.to.join(", "));
  formData.append("subject", emailParams.subject);
  formData.append("text", emailParams.text);
  formData.append("html", emailParams.html);
  formData.append("recipient-variables", JSON.stringify(recipientVars));
  const sent = await fetch(
    `https://api.mailgun.net/v3/${emailParams.domain}/messages`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Basic ${btoa(`api:${emailParams.apiKey}`)}`,
      },
    }
  );
  console.log(sent);
};
