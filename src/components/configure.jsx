// <copyright file="configure.jsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import { useEffect, useState } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

// Configure page.
const Configure = () => {
    const [selectedPage, setSelectedPage] = useState("page1");
    const [threadId, setThreadId] = useState("");

    useEffect(() => {
        if (threadId && selectedPage) {
            microsoftTeams.pages.config.registerOnSaveHandler(function (saveEvent) {
                const contentUrl = `${window.location.origin}/${selectedPage}/${threadId}`;
                console.log(`Adding tab with URL: ${contentUrl}`);
                microsoftTeams.pages.config.setConfig({
                    entityId: JSON.stringify({ threadId, page: selectedPage }),
                    contentUrl,
                    suggestedDisplayName: selectedPage,
                    websiteUrl: contentUrl,
                });
                saveEvent.notifySuccess();
            });
            microsoftTeams.pages.config.setValidityState(true);
        }
    }, [threadId, selectedPage]);

    useEffect(() => {
        microsoftTeams.app.initialize().then(() => {
            microsoftTeams.app.getContext().then((context) => {
                const contextThreadId = context.channel?.id || context.chat?.id;
                if (contextThreadId) {
                    setThreadId(contextThreadId);
                    microsoftTeams.app.notifySuccess();
                } else {
                    microsoftTeams.app.notifyFailure("Unable to retrieve channel or chat ID.");
                }
            });
        });
    }, []);

    return (
        <div>
            <h2>App Caching</h2>
            <h3>This sample app only supports app caching.</h3>
            <p>Please click save button to proceed.</p>
            <label htmlFor="componentSelect">Select Component:</label>
            <select 
                id="componentSelect" 
                value={selectedPage} 
                onChange={(e) => setSelectedPage(e.target.value)}
            >
                <option value="page1">Page1</option>
                <option value="page2">Page2</option>
            </select>
        </div>
    );
};

export default Configure;