import { useEffect, useState } from "react";
import { fetchIPFS } from "lib/ipfs";

import { useAppSelector } from "store";

const usePubImg = (): [File | null, (arg0: File | null) => void] => {
  const [pubImg, setPubImg] = useState<File | null>(null);
  const publication = useAppSelector((state) => state.publication);
  useEffect(() => {
    const x = async () => {
      if (publication && publication.image) {
        const b = await fetchIPFS(publication.image);
        if (b) {
          setPubImg(new File([b], "previewImg.jpeg"));
        }
      }
    };
    x();
  }, [publication]);
  return [pubImg, setPubImg];
};

export default usePubImg;
