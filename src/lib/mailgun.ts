//import {unified} from 'unified'
//import remarkParse from 'remark-parse'
//import remarkRehype from 'remark-rehype'
//import rehypeDocument from 'rehype-document'
//import rehypeFormat from 'rehype-format'
//import rehypeStringify from 'rehype-stringify'
//import {reporter} from 'vfile-reporter'

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
  apiKey: string;
};
export const sendMessage = async (emailParams: EmailParams) => {
  // unified()
  //   .use(remarkParse)
  //   .use(remarkRehype)
  //   .use(rehypeDocument, {title: '👋🌍'})
  //   .use(rehypeFormat)
  //   .use(rehypeStringify)
  //   .process('# Hello world!')
  //   .then(
  //     (file) => {
  //       console.error(reporter(file))
  //       console.log(String(file))
  //     },
  //     (error) => {
  //       // Handle your error here!
  //       throw error
  //     }
  //   )
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
