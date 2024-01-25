import { Outlet, Link } from "react-router-dom";
import styles from "./Layout.module.css";
import UFLogo from "../../assets/UF.png";
import { CopyRegular, ShareRegular } from "@fluentui/react-icons";
import { Dialog, Stack, TextField, ICommandBarStyles, IButtonStyles } from "@fluentui/react";
import { useContext, useEffect, useState } from "react";
import { HistoryButton, ShareButton } from "../../components/common/Button";
import { AppStateContext } from "../../state/AppProvider";
import { CosmosDBStatus } from "../../api";

// fork code
import UploadModal from "../components/UploadModal"
import { BlobServiceClient } from "@azure/storage-blob";
// end fork code


const Layout = () => {
    const [isSharePanelOpen, setIsSharePanelOpen] = useState<boolean>(false);
    const [copyClicked, setCopyClicked] = useState<boolean>(false);
    const [copyText, setCopyText] = useState<string>("Copy URL");
    const appStateContext = useContext(AppStateContext)

    // fork code
    const [displayUploadModal, setDisplayUploadModal] = useState(true);
    const blobSasUrl = "https://aiproposalsexample.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-01-25T22:41:11Z&st=2024-01-25T14:41:11Z&spr=https&sig=W2EYeBuB%2B%2BbtpTjFux13kG74fe8LWSXhtmAn2Gsl5lE%3D";
    const blobServiceClient = new BlobServiceClient(blobSasUrl);
    const containerName = "webtestcontainer"
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // end fork code

    const handleShareClick = () => {
        setDisplayUploadModal(true);
    };

    const handleSharePanelDismiss = () => {
        setIsSharePanelOpen(false);
        setCopyClicked(false);
        setCopyText("Copy URL");
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopyClicked(true);
    };

    const handleHistoryClick = () => {
        appStateContext?.dispatch({ type: 'TOGGLE_CHAT_HISTORY' })
    };

    useEffect(() => {
        if (copyClicked) {
            setCopyText("Copied URL");
        }
    }, [copyClicked]);

    useEffect(() => { }, [appStateContext?.state.isCosmosDBAvailable.status]);

    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                    <Stack horizontal verticalAlign="center">
                        <img
                            src={UFLogo}
                            className={styles.headerIcon}
                            aria-hidden="true"
                        />
                        <Link to="/" className={styles.headerTitleContainer}>
                            <h1 className={styles.headerTitle}>UF Chat With Docs</h1>
                        </Link>
                    </Stack>
                    <Stack horizontal tokens={{ childrenGap: 4 }}>
                        {(appStateContext?.state.isCosmosDBAvailable?.status !== CosmosDBStatus.NotConfigured) &&
                            <HistoryButton onClick={handleHistoryClick} text={appStateContext?.state?.isChatHistoryOpen ? "Hide chat history" : "Show chat history"} />
                        }
			
                        <ShareButton onClick={handleShareClick} />
                    </Stack>

                </Stack>
            </header>
            <Outlet />
	    <div className="fixed top-0 bottom-0 left-0 right-0">

            <UploadModal
	        containerClient={containerClient}
		setDispley={setDisplayUploadModal}
            />
	    </div>

            <Dialog
                onDismiss={handleSharePanelDismiss}
                hidden={!isSharePanelOpen}
                styles={{

                    main: [{
                        selectors: {
                            ['@media (min-width: 480px)']: {
                                maxWidth: '600px',
                                background: "#FFFFFF",
                                boxShadow: "0px 14px 28.8px rgba(0, 0, 0, 0.24), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                borderRadius: "8px",
                                maxHeight: '200px',
                                minHeight: '100px',
                            }
                        }
                    }]
                }}
                dialogContentProps={{
                    title: "Share the web app",
                    showCloseButton: true
                }}
            >
                <Stack horizontal verticalAlign="center" style={{ gap: "8px" }}>
                    <TextField className={styles.urlTextBox} defaultValue={window.location.href} readOnly />
                    <div
                        className={styles.copyButtonContainer}
                        role="button"
                        tabIndex={0}
                        aria-label="Copy"
                        onClick={handleCopyClick}
                        onKeyDown={e => e.key === "Enter" || e.key === " " ? handleCopyClick() : null}
                    >
                        <CopyRegular className={styles.copyButton} />
                        <span className={styles.copyButtonText}>{copyText}</span>
                    </div>
                </Stack>
            </Dialog>
        </div>
    );
};

export default Layout;
