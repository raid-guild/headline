export type EmailParams = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  domain: string;
  html: string;
  apiKey: string;
  infra: "main" | "eu";
};
export const sendMessage = async (emailParams: EmailParams) => {
  console.log(emailParams);
  const recipientVars = emailParams.to.reduce(
    (prev, val) => ({ ...prev, [val]: {} }),
    {}
  );
  const baseUri =
    emailParams.infra === "eu"
      ? "https://api.eu.mailgun.net/v3"
      : "https://api.mailgun.net/v3";
  const formData = new FormData();
  formData.append("from", emailParams.from);
  formData.append("to", emailParams.to.join(", "));
  formData.append("subject", emailParams.subject);
  formData.append("text", emailParams.text);
  formData.append("html", emailParams.html);
  formData.append("recipient-variables", JSON.stringify(recipientVars));
  const sent = await fetch(`${baseUri}/${emailParams.domain}/messages`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Basic ${btoa(`api:${emailParams.apiKey}`)}`,
    },
  });
  console.log(sent);
};
