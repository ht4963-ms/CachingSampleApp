import React from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import {
    BrowserRouter,
    Route,
    Routes,
    useLocation,
    useNavigate
} from 'react-router-dom';
import Configure from "../components/configure";
import { AppCacheTab1 } from "../components/app-cache-tab";
import { AppCacheTab2 } from "../components/app-cache-tab-2";
import Index from "../components/index";
import { reportDocumentDimensions } from "../components/utils";

const AppContent = () => {
    const [appInitialized, setAppInitialized] = React.useState(false);

    let app = microsoftTeams.app;

    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        app.initialize().then(app.getContext).then((context: any) => {
             // Get default theme from app context and set app-theme
            let defaultTheme = context.app.theme;

            switch (defaultTheme) {
                case 'dark':
                    console.log("theme-dark");
                    break;
                default:
                    console.log('theme-light');
            }

            // Handle app theme when 'Teams' theme changes
            microsoftTeams.app.registerOnThemeChangeHandler(function (theme) {
                switch (theme) {
                    case 'dark':
                        console.log('Register theme-dark');
                        break;
                    case 'default':
                        console.log('Register theme-light');
                        break;
                    case 'contrast':
                        console.log('Register theme-contrast');
                        break;
                    default:
                        return console.log('Register Default theme-dark');
                }
            });

            microsoftTeams.teamsCore.registerBeforeUnloadHandler((readyToUnload: any) => {
                console.log(`>>>>>>> app is unloading`);
                reportDocumentDimensions();
                setTimeout(() => {
                    readyToUnload();
                }, 100);
                return true;
            });

            microsoftTeams.teamsCore.registerOnLoadHandler((data: any) => {
                console.log(data.contentUrl, data.entityId);
                console.log(`>>>>>>>***** App onLoad handler called with contentUrl: ${data.contentUrl} and entityId: ${data.entityId}`);
                reportDocumentDimensions();
                let entity: any;
                if (data.entityId && data.contentUrl) {
                    try {
                        entity = JSON.parse(data.entityId);
                    } catch (error) {
                        entity = {};
                    }

                    const path = `${new URL(data.contentUrl).pathname}`;
                    console.log(`>>>>>>>***** Parsed path: ${path} for entity: ${entity}. location.pathname is currently: ${location.pathname}`);
                    if (path !== location.pathname) {
                        console.log(`>>>>>>>***** Navigating to ${path} for threadId ${entity.threadId}`);
                        if (navigate) {
                            navigate(`${new URL(data.contentUrl).pathname}`);
                        } else {
                            console.error(`navigate is undefined--cannot navigate to page.`);
                        }
                    } else {
                        console.log(`>>>>>>>***** Already on the correct page: ${data.contentUrl}.`);
                        setTimeout(() => {
                            microsoftTeams.app.notifySuccess();
                        }, 1000);
                        reportDocumentDimensions();
                        setTimeout(() => {
                            console.log(`>>>>>>>***** Reporting document dimensions after 1 seconds`);
                            reportDocumentDimensions();
                        }, 1000);
                    }
                }
            });

            setAppInitialized(true);

        }).catch(function (error: any) {
            console.log(error, "Could not register handlers.");
        });

        return () => {
            console.log("useEffect cleanup - Tab");
        };

    }, [app, navigate]);

    return (
        <React.Fragment>
            {
                appInitialized ? (
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/configure" element={<Configure />}/>
                    <Route path="/page1/:entityId" element={<AppCacheTab1 />}/>
                    <Route path="/page2/:entityId" element={<AppCacheTab2 />}/>
                    <Route path="/personal" element={<AppCacheTab1 />}/>
                </Routes>) : null
            }
        </React.Fragment>
    );
};
export const AppRoute = () => {
    return (
        <React.Fragment>
            <BrowserRouter> 
                <AppContent />
            </BrowserRouter>
        </React.Fragment>
    );
}