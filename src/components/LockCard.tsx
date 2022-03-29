import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "components/Button";
import Title from "components/Title";
import Text from "components/Text";
import { Lock } from "services/lock/slice";
import { PublicationLock } from "services/publication/slice";

import { useAppSelector } from "store";
import { checkoutRedirect } from "lib/unlock";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 26rem;
`;

const LockDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem 0.8rem 0rem 0rem;
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  border-bottom: none;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  padding: 3.2rem;
  gap: 1.6rem;
`;

const LockDataRowContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 17rem;
`;

const StyledText = styled(Text)`
  flex: 1 1 auto;
  max-width: 7.5rem;
`;

const LockMemberContainer = styled.div`
  border-radius: 0rem 0rem 0.8rem 0.8rem;
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  border-top: none;
  padding: 2.4rem 1.6rem 2.4rem 2.4rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

export const LockData = ({ lock }: { lock: Lock }) => {
  return (
    <>
      <Title size="sm" color="label">
        {lock.name}
      </Title>
      <div>
        <LockDataRowContainer>
          <StyledText size="base" color="grey">
            Price
          </StyledText>
          <StyledText size="base" color="label">
            {lock.keyPriceSimple} {lock.keyTokenSymbol}
          </StyledText>
        </LockDataRowContainer>
        <LockDataRowContainer>
          <StyledText size="base" color="grey">
            Duration
          </StyledText>
          <StyledText size="base" color="label">
            {lock.expiration / 60 / 60 / 24} Days
          </StyledText>
        </LockDataRowContainer>
        <LockDataRowContainer>
          <StyledText size="base" color="grey">
            Quantity
          </StyledText>
          <StyledText size="base" color="label">
            {lock.maxNumber === -1 ? "Infinite" : lock.maxNumber}
          </StyledText>
        </LockDataRowContainer>
      </div>
    </>
  );
};

export const LockCard = ({
  lock,
  showSubscribe,
}: {
  lock: Lock;
  showSubscribe: boolean;
}) => {
  const [pubLock, setPubLock] = useState<PublicationLock | null | undefined>(
    null
  );
  const publication = useAppSelector((state) => state.publication);
  useEffect(() => {
    setPubLock(
      publication.locks.find(
        (l) => l.address.toLowerCase() === lock.lockAddress
      )
    );
  });
  console.log("pubLock");
  console.log(pubLock);
  console.log(showSubscribe);
  return (
    <CardContainer>
      <LockDataContainer>
        <LockData lock={lock} />
      </LockDataContainer>
      <LockMemberContainer>
        <Text size="sm" color="primary">
          {lock.outstandingKeys} Members
        </Text>
        {showSubscribe && pubLock ? (
          <a href={checkoutRedirect(publication?.name, [pubLock])}>
            <Button size="md" color="primary" variant="contained">
              Subscribe
            </Button>
          </a>
        ) : (
          <></>
        )}
      </LockMemberContainer>
    </CardContainer>
  );
};

export const LockCards = ({
  locks,
  showSubscribe = false,
}: {
  locks: Lock[];
  showSubscribe: boolean;
}) => {
  console.log("Locks");
  console.log(locks);
  return (
    <>
      {locks.map((lock) => {
        return (
          <LockCard
            key={lock.lockAddress}
            lock={lock}
            showSubscribe={showSubscribe}
          />
        );
      })}
    </>
  );
};
