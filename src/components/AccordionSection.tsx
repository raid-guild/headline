import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import ExternalLink from "components/ExternalLink";
import styled from "styled-components";

// tried to map this, but it broke the accordion since it wasnt recognizing the value

const StyledAccordionRoot = styled(AccordionPrimitive.Root)``;

const StyledAccordionHeader = styled(AccordionPrimitive.Header)`
  font-size: 4.8rem;
  line-height: 5.2rem;
  background: transparent;
  color: #f0efef;
  @media (max-width: 768px) {
    margin-bottom: 2.4rem;
    font-size: 3.6rem;
    line-height: 4.2rem;
  }
`;

const StyledAccordionItem = styled(AccordionPrimitive.Item)`
  display: flex;
  flex-direction: column;
  border-bottom: 0.2rem solid #f0efef;
`;

const StyledExternalLink = styled(ExternalLink)`
  font-weight: 600;
`;

const StyledAccordionTrigger = styled(AccordionPrimitive.Trigger)`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 4.8rem;
  font-weight: 700;
  line-height: 5.2rem;
  background: transparent;
  color: #f0efef;
  @media (max-width: 768px) {
    font-size: 3.6rem;
    line-height: 4.2rem;
  }
`;

// const AccordionChevron = styled(HiChevronDown)`
//   background: red;
//   transition: "transform 300ms";
//   &: [data-state= "open" ] {
//     transform: "rotate(180deg)";
//     background: green;
//   }
// `;

const StyledAccordionTitle = styled.span`
  align-self: flex-start;
  text-align: left;
  max-width: none;
  flex-grow: 0;
  flex-wrap: wrap;
`;

const StyledAccordionContent = styled(AccordionPrimitive.Content)`
  font-size: 2rem;
  line-height: 2.8rem;
  color: #f0efef;
  max-width: none;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
`;

const AccordionSection = () => {
  return (
    <StyledAccordionRoot type="single" collapsible defaultValue="item-1">
      <StyledAccordionItem value="item-1">
        <StyledAccordionHeader>
          <StyledAccordionTrigger>
            <StyledAccordionTitle>
              What does powered by Unlock mean?
            </StyledAccordionTitle>
            {/* <AccordionChevron aria-hidden="true" /> */}
          </StyledAccordionTrigger>
        </StyledAccordionHeader>
        <StyledAccordionContent>
          The Unlock protocol provides the membership option for creators to set
          up a paywall. While the subscription feature is available, it&apos;s
          up to the creator whether to use it or not.
        </StyledAccordionContent>
      </StyledAccordionItem>
      <StyledAccordionItem value="item-2">
        <StyledAccordionHeader>
          <StyledAccordionTrigger>
            <StyledAccordionTitle>
              How can this platform be free of charge?
            </StyledAccordionTitle>
            {/* <AccordionChevron aria-hidden="true" /> */}
          </StyledAccordionTrigger>
        </StyledAccordionHeader>
        <StyledAccordionContent>
          Most of the technology used to build HEADLINE is free and open source.
          Maintenance and future builds are collaborative and we welcome your
          contribution.
        </StyledAccordionContent>
      </StyledAccordionItem>
      <StyledAccordionItem value="item-3">
        <StyledAccordionHeader>
          <StyledAccordionTrigger>
            <StyledAccordionTitle>
              How do I send my article as a newsletter?
            </StyledAccordionTitle>
            {/* <AccordionChevron aria-hidden="true" /> */}
          </StyledAccordionTrigger>
        </StyledAccordionHeader>
        <StyledAccordionContent>
          You will have to set up a Mailgun domain.{" "}
          <StyledExternalLink href="https://mattharris.io/setting-up-mailgun/">
            Here is a tutorial
          </StyledExternalLink>{" "}
          on how you can do that. Once you have the domain and apiKey, you can
          enter that information in the Publish Settings, under Email Service.
          After that&apos;s completed, you can send your blog as a newsletter
          when you publish.
        </StyledAccordionContent>
      </StyledAccordionItem>
      <StyledAccordionItem value="item-4">
        <StyledAccordionHeader>
          <StyledAccordionTrigger>
            <StyledAccordionTitle>
              Is HEADLINE an emailing service?
            </StyledAccordionTitle>
            {/* <AccordionChevron aria-hidden="true" /> */}
          </StyledAccordionTrigger>
        </StyledAccordionHeader>
        <StyledAccordionContent>
          Currently, HEADLINE does not provide emailing services. For this first
          version, we focused on empowering creators to own their content. If
          you would like to help build an emailing service for a future
          iteration, please let us know.
        </StyledAccordionContent>
      </StyledAccordionItem>
      <StyledAccordionItem value="item-5">
        <StyledAccordionHeader>
          <StyledAccordionTrigger>
            <StyledAccordionTitle>
              Can I move my newsletter from another platform to HEADLINE?
            </StyledAccordionTitle>
            {/* <AccordionChevron aria-hidden="true" /> */}
          </StyledAccordionTrigger>
        </StyledAccordionHeader>
        <StyledAccordionContent>
          Yes. You can import your subscribers from another publishing platform
          into HEADLINE when you have their crypto wallet addresses. HEADLINE
          uses the transparency of blockchain technology and requires this
          information to add readers to your subscriber list.
        </StyledAccordionContent>
      </StyledAccordionItem>
    </StyledAccordionRoot>
  );
};

export default AccordionSection;
