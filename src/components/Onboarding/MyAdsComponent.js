import React from "react";
import { NativeBanner } from "../../NativeAds/NativeBannerads";
import { useSelector } from "react-redux";
const MyAdsComponet = ({currentPage}) => {
  const { AddConfig } = useSelector(state => state.remoteConfigReducer);
  console.log(AddConfig,"SHNSNSN");
    console.log(currentPage === 3 && AddConfig.Native_Intro3);
  if (currentPage === 0 && AddConfig.NativeIntro) {
    return <NativeBanner reposName={'imageAd1'} myindex={0} />;
  } else if (currentPage === 1 && AddConfig.NativeIntro) {
    return <NativeBanner reposName={'imageAd2'} myindex={1} />;
  } else if (currentPage === 2 &&  AddConfig.NativeIntro) {
    return <NativeBanner reposName={'imageAd3'} myindex={2} />;
  } else if (currentPage === 3 && AddConfig.NativeIntro) {
    return <NativeBanner reposName={'imageAd4'} myindex={3} />;
  } else {
    return null;
  }
};

export default   MyAdsComponet
