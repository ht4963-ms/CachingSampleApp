// <copyright file="app-cache-tab.tsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React from "react";
import { useParams } from 'react-router-dom';
import "./index.css";
import { app } from "@microsoft/teams-js";
import { loadNewEntityData } from "./utils";

export const AppCacheTab2 = () => {

    const { entityId } = useParams<{ entityId: string }>();
    const [currentEntityId, setCurrentEntityId] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (entityId !== currentEntityId || loading) {
            console.log(`>>>>> Entity ID changed from ${currentEntityId} to ${entityId}`);
            setCurrentEntityId(entityId || "");
            loadNewEntityData(entityId || "", setLoading);
        }
    }, [entityId]);
    
    React.useEffect(() => {
        setTimeout(() => {
            console.log(`>>>>> Page 2 sending notifySuccess`);
            app.notifySuccess();
        }, 1000);
    }, []);
    
    return (
        <div style={{ backgroundColor: 'yellow', color: 'red', height: '800px', padding: '20px' }}>
            {loading ? <div>Loading...</div> :
                (
                    <div>
                        <h2>Page 2</h2>
                        <h3>Entity ID: {entityId}</h3>
                        <a style={{ color: 'red' }} href="msteams:l/entity/08bfc10d-63b9-441c-a845-2b49fac088e5/_djb2_msteams_prefix_709515409?context=%7B%22channelId%22%3A%2219%3AM1RbJSJ7bH7oJYsNbrWZsOId2TYeM8acYK9Sr06lKT41%40thread.tacv2%22%7D&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47">Page 1</a>
                    </div>
                )
            }
            </div>
    );
};


