import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { HiPlus, HiMinus } from "react-icons/hi";
import Text from "components/Text";
import styled from "styled-components";

const accordionContent = [
  {
    text: "What does powered by Unlock mean?",
    content:
      "The Unlock protocol provides the membership option for creators to set up a paywall. While the subscription feature is available, it's up to the creator whether to use it or not.",
  },
  {
    title: "How can this platform be free of charge?",
    content:
      "Most of the technology used to build HEADLINE is free and open source. Maintenance and future builds are collaborative and we welcome your contribution.",
  },
  {
    title: "How do I send my article as a newsletter?",
    content:
      "Go to Publish, then Settings, and enter your third party API keyof, under Email Service. After that's completed you can send your blog as a newsletter when you Publish the post.",
  },
  {
    title: "Is HEADLINE an emailing service?",
    content:
      "Currently, HEADLINE does not provide emailing services. For this first version, we focused on empowering creators to own their content. If you would like to help build an emailing service for a future iteration, please let us know.",
  },
  {
    title: "Can I move my newsletter from another platform to HEADLINE?",
    content:
      "Yes. You can import your subscribers from another publishing platform into HEADLINE when you have their crypto wallet addresses. HEADLINE uses the transparency of blockchain technology and requires this information to add readers to your subscriber list.",
  },
];

const StyledAccordionRoot = styled(AccordionPrimitive.Root)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 80rem;
  flex-flow: row wrap;
`;

const StyledAccordionHeader = styled(AccordionPrimitive.Header)`
  font-size: 4.8rem;
  line-height: 5.2rem;
  background: transparent;
  color: #f0efef;
`;

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-width: 100%;
`;

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger)`
  font-size: 4.8rem;
  line-height: 5.2rem;
  background: transparent;
  color: #f0efef;
`;

const StyledAccordionTitle = styled.span`
  align-self: flex-start;
  text-align: left;
`;

const StyledAccordionContent = styled(AccordionPrimitive.Content)`
  font-size: 2rem;
  line-height: 2.8rem;
  color: #f0efef;
  max-width: none;
  flex-grow: 0;
  flex-wrap: wrap;
`;

const AccordionSection = () => {
  return (
    <StyledAccordionRoot type="single" collapsible>
      {accordionContent.map((item, index) => (
        <StyledAccordionItem key={`item-${index}`} value={`item-${index}`}>
          <StyledAccordionHeader>
            <StyledAccordionTrigger>
              <StyledAccordionTitle>{item.title}</StyledAccordionTitle>
              {/* <HiPlus aria-hidden /> */}
            </StyledAccordionTrigger>
          </StyledAccordionHeader>
          <StyledAccordionContent>{item.content}</StyledAccordionContent>
        </StyledAccordionItem>
      ))}
    </StyledAccordionRoot>
  );
};

export default AccordionSection;
