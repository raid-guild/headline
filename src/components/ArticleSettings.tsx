import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useRadioState, Radio } from "reakit/Radio";
import styled from "styled-components";

import Button from "components/Button";
import { Dialog, DialogContainer } from "components/Dialog";
import ExternalLink from "components/ExternalLink";
import Icon from "components/Icon";
import FormTextArea from "components/FormTextArea";
import Text from "components/Text";
import Title from "components/Title";
import {
  articleRegistrySelectors,
  removeRegistryArticle,
} from "services/articleRegistry/slice";
import { useAppDispatch, useAppSelector } from "store";
import { fetchIPFS } from "lib/ipfs";

import portrait from "assets/portrait.svg";
import settings from "assets/settings.svg";

const ReceiverSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  background: ${({ theme }) => theme.colors.almostWhite};
`;

const SocialPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.almostWhite};
  gap: 1.6rem;
`;

const ImagePreview = styled.div`
  border: ${({ theme }) => `.2rem dashed ${theme.colors.lightGrey}`};
  max-height: 11rem;
  max-width: 24rem;
  height: 100%;
  width: 100%;
  height: 11rem;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const SendingTestEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.almostWhite};
  gap: 1.6rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2.4rem;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledIconButton = styled(Button)`
  padding: 0rem;
  height: auto;
`;

const StyledIcon = styled(Icon)`
  padding: 1rem;
  height: auto;
`;

export const ArticleSettings = ({
  streamId,
  saveArticle,
}: {
  streamId: string | undefined;
  saveArticle: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string | File | undefined,
    arg4: boolean
  ) => void;
}) => {
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );
  const loadingDelete = useAppSelector((state) => state.removeArticle.loading);
  const navigate = useNavigate();

  const radio = useRadioState({
    state: `${article?.paid ? "paid" : "free"}`,
  });
  const hiddenImageInput = useRef<HTMLInputElement>(null);
  const [previewImg, setPreviewImg] = useState<File | null>(null);
  const [description, setDescription] = useState(article?.description || "");
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const x = async () => {
      if (article?.previewImg) {
        const b = await fetchIPFS(article.previewImg);
        if (b) {
          setPreviewImg(new File([b], "previewImg.jpeg"));
        }
      }
    };
    x();
  }, [article?.previewImg]);

  const clickImageInput = () => {
    hiddenImageInput?.current?.click();
  };

  const uploadImage = useCallback(
    (e) => {
      const input = hiddenImageInput.current || { files: null };
      // const validImage = false;
      if (input.files) {
        const file = input.files[0];
        if (!file) {
          return;
        }
        // validImage =
        //   file.type === "image/jpeg" ||
        //   file.type === "image/png" ||
        //   file.type === "image/svg+xml";
        setPreviewImg(file);
      }
    },
    [hiddenImageInput.current]
  );

  const submitSettings = useCallback(async () => {
    const a = await saveArticle(
      article?.text || "",
      article?.title || "",
      description,
      previewImg || undefined,
      radio.state !== "free"
    );
    setHide(true);
  }, [description, article, previewImg, radio.state]);

  const deleteArticle = useCallback(async () => {
    // dispatch delete
    if (streamId) {
      await dispatch(removeRegistryArticle(streamId));
      navigate("/publish");
    }
  }, []);

  return (
    <Dialog
      baseId="article-settings"
      backdrop={true}
      hideModal={hide}
      disclosure={
        <StyledIconButton size="sm" color="primary" variant="outlined">
          <StyledIcon size="md" src={settings} alt="settings button" />
        </StyledIconButton>
      }
    >
      <DialogContainer>
        <Text size="base">Post setting</Text>
        <ReceiverSettingContainer>
          <Title size="sm" color="helpText">
            This post is for
          </Title>
          <RadioButtonContainer>
            <label>
              <Radio {...radio} value="free" /> Everyone
            </label>
            <label>
              <Radio {...radio} value="paid" disabled={true} /> Paid subscribers
            </label>
          </RadioButtonContainer>
        </ReceiverSettingContainer>
        <SocialPreviewContainer>
          <Title size="sm" color="helpText">
            Social Preview
          </Title>
          <Text size="base" color="grey">
            Changing the preview text will only affect the social preview, not
            the post content itself
          </Text>
          {previewImg ? (
            <img
              src={URL.createObjectURL(previewImg)}
              onClick={clickImageInput}
              style={{ height: "11rem", objectFit: "contain" }}
            />
          ) : (
            <ImagePreview onClick={clickImageInput}>
              <Icon size="lg" src={portrait} alt="portrait" />
            </ImagePreview>
          )}
          <input
            type="file"
            ref={hiddenImageInput}
            style={{ display: "none" }}
            onClick={uploadImage}
            onChange={uploadImage}
          />
          <FormTextArea
            title="Preview text"
            errorMsg=""
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target?.value)
            }
          />
        </SocialPreviewContainer>
        <SendingTestEmailContainer>
          <Title size="sm" color="helpText">
            Sending a test email
          </Title>
          <Text size="base" color="grey">
            Please configure your SMTP credentials in the setting page in order
            to send out a test email
          </Text>
          <ExternalLink href="www.google.com">
            <Text size="base" color="primary" weight="semibold">
              Learn More
            </Text>
          </ExternalLink>
        </SendingTestEmailContainer>
        <ButtonContainer>
          <Button
            size="md"
            color="primary"
            variant="contained"
            onClick={submitSettings}
          >
            Save
          </Button>
          {streamId && (
            <Button
              size="md"
              color="error"
              variant="contained"
              onClick={deleteArticle}
              loadingText="Deleting..."
              isLoading={loadingDelete}
            >
              Delete this post
            </Button>
          )}
        </ButtonContainer>
      </DialogContainer>
    </Dialog>
  );
};
