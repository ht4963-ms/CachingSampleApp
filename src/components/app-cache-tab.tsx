// <copyright file="app-cache-tab.tsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React from "react";
import { useParams } from 'react-router-dom';
import "./index.css";
import { app } from "@microsoft/teams-js";
import { loadNewEntityData, reportDocumentDimensions } from "./utils";

export const AppCacheTab1 = () => {

    const { entityId } = useParams<{ entityId: string }>();
    const [currentEntityId, setCurrentEntityId] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(true);
    const [textContent, setTextContent] = React.useState<string>("");
    const [dictationContent, setDictationContent] = React.useState<string>("");
    const [listening, setListening] = React.useState<boolean>(false);
    const recognition = React.useMemo(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US'; // Set language
                recognition.continuous = true; // Keep listening until stopped
                recognition.interimResults = false; // Only return final results

                recognition.onstart = () => console.log('Speech recognition started');
                recognition.onresult = (event) => {
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            console.log('You said:', event.results[i][0].transcript);
                            setDictationContent(event.results[i][0].transcript);
                        }
                    }
                };
                recognition.onerror = (event) => console.error('Error:', event.error);
                recognition.onend = () => console.log('Speech recognition ended');

                recognition.start();
                return recognition;
            }
            catch (e) {
                console.error('Error setting up SpeechRecognition:', e);
                return null;
            }

        } else {
            console.error('Speech recognition not supported in this browser.');
        }
    }, []);

    const dictateStart = () => {
        if (recognition) {
            setListening(true);
            recognition.start();
        }
    };

    const dictateStop = () => {
        if (recognition) {
            setListening(false);
            recognition.stop();
        }
    };

    const testMedia = () => {
        const constraints = { audio: true};
        setTextContent(" Requesting permission... ");
        navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            setTextContent(" Permission granted.");
        })
        .catch(function (err) {
            console.log(err);
            setTextContent("Error name: " + err.name + "; Error message: " + err.message + "; Error constraintName: " + err.constraintName);
        });
    }

    React.useEffect(() => {
        if (entityId !== currentEntityId || loading) {
            console.log(`>>>>> Entity ID changed from ${currentEntityId} to ${entityId}`);
            setCurrentEntityId(entityId || "");
            loadNewEntityData(entityId || "", setLoading);
        }
    }, [entityId]);
    
    React.useEffect(() => {
        reportDocumentDimensions();

        setTimeout(() => {
            console.log(`>>>>> Page 1 sending notifySuccess`);
            app.notifySuccess();
        }, 1000);
    }, []);
    
    return (
        <div style={{ backgroundColor: 'blue', color: 'white', height: '800px', padding: '20px' }}>
            {
                loading ?
                <div>Loading...</div>
                :
                (
                    <div>
                        <h2>Page 1</h2>
                        <h3>Entity ID: {entityId}</h3>
                        <div>
                            <h2>Media</h2>
                            <p>
                                Permissions to use a media input. Requested by methods like <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia">navigator.mediaDevices.getUserMedia</a>
                            </p>
                            <p><button value="media" onClick={() => testMedia()}>Test Permissions</button></p>
                            <p><div id="media">{textContent}</div></p>

                            {listening ? (
                                <button value="dictate" onClick={() => dictateStop()}>Stop Dictation</button>
                            ) : (
                                <button value="dictate" onClick={() => dictateStart()}>Start Dictation</button>
                                )}
                            {listening && <span style={{ marginLeft: '10px' }}>🎤 Listening...</span>}
                            <p><div id="dictation" style={{ border: '1px solid #A0A0A0', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)', fontFamily: '"Segoe UI"', fontSize: '14px', height: '32px', padding: '6px 12px', width: '300px' }}>{dictationContent}</div></p>
                        </div>
                        <a style={{ color: 'white' }} href="msteams:l/entity/08bfc10d-63b9-441c-a845-2b49fac088e5/_djb2_msteams_prefix_709516498?context=%7B%22channelId%22%3A%2219%3AM1RbJSJ7bH7oJYsNbrWZsOId2TYeM8acYK9Sr06lKT41%40thread.tacv2%22%7D&tenantId=72f988bf-86f1-41af-91ab-2d7cd011db47">Page 2</a>
                    </div>

                    
                )
            }
        </div>
    );
};

