import { REMOTE_CONFIG, USER_CONSENT } from "../type";
const initialState  = {
   AddConfig : {
    BannerHome:true,
    SplashInter:true,
    InterHome:true,
    NativeLanguage:true,
    NativeIntro:true,
    AppOpenResume:true,
    LanguageScreen2:true
   },
   isConsent:false
}

 const remoteConfigReducer = (state = initialState ,action) => {
    switch (action.type) {
        case REMOTE_CONFIG:
            return {
                ...state,
                AddConfig:action.payload
            }
            case USER_CONSENT:
                return {
                    ...state,
                    isConsent:action.payload
                }
        default:
          return  state;
    }
}
export default remoteConfigReducer