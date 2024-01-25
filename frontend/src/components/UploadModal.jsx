import React, {useState, useEffect, useRef } from "react";
import { FaDeleteLeft } from "react-icons/fa6";

const UploadModal = ({containerClient, setDisplay}) => {

    const [fileStatusMessages, setFileStatusMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationFiles, setConversationFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);


const fetchFiles = async () => {
    let files = [];
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
	    files.push(blobItem.value.name)
	    blobItem = await iter.next();
	}
	setConversationFiles(files);
}

useEffect(() => {
	fetchFiles();
}, []);

    
    const handleFileDelete = async (fileName) => {
        console.log(`Attempting to delete file: ${fileName}`);
    
        try {
          await containerClient.deleteBlob(fileName);
          console.log(`File deleted: ${fileName}`);
          setConversationFiles(prevFiles => prevFiles.filter(file => file !== fileName));
          setFileStatusMessages([{ text: `${fileName} completed.`}]);
    
        } catch (error) {
          console.error(`Failed to delete file: ${fileName}`, error);
        }
    };
 
    const handleFileUpload = async () => {
      setIsLoading("Loading");
        const promises = [];
        for (const file of selectedFiles) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);

    
      try {
         setIsLoading(false);
              setSelectedFiles([]);
              setFileStatusMessages([{ text: "Upload completed."}]);
              fileInputRef.current.value = null;
              fetchFiles();


      } catch (error) {
        console.error("Error uploading file(s):", error);
      }
    };



    function handleFilesSelected(e) {
      setFileStatusMessages([]);
      setSelectedFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.target.files),
      ]);
    }
    
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    



    return (
	    <div>
	    <input type="checkbox" id="my_modal_6" className="modal-toggle" defaultChecked="true" />
	      <dialog className="modal backdrop-blur-[2px]">
              <div className="modal-box w-11/12 max-w-5xl border border-accent">
                <h3 className="text-xl font-bold">Upload your files</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="file-input file-input-bordered file-input-primary w-full modal-action"
                  onChange={handleFilesSelected}
                />

                {conversationFiles.length > 0 && (
                  <>
                    <br />
                    <p><strong>Current Files</strong>:</p>
                    <ol className="ml-5 min-h-16 max-h-32 overflow-y-auto font-pt-mono text-sm">
                      {conversationFiles.map((fileName, index) => (
                        <li key={`${fileName}-${index}`} className="flex items-center">
                          <FaDeleteLeft onClick={() => handleFileDelete(fileName)} className="inline-block mr-2 cursor-pointer text-secondary transform -scale-x-100" size="20px" title={`Delete file: ${fileName}`}/>
                          {fileName}
                        </li>
                      ))}
                    </ol>
                  </>
                )}
                <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="mt-2">
                        {file.name}
                      </li>
                    ))}
                    {fileStatusMessages.map((msg, index) => (
                      <li key={`${msg.text}-${index}`} className="mt-2">
                        {msg.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="modal-action">
                  {isLoading ? (
                    <button className="btn btn-primary">
                      <span className="loading loading-spinner"></span>
                      {isLoading}
                    </button>
                  ) : (
                    <button
                      className={`btn btn-primary mr-2 ${isLoading ? "btn-loading" : ""}`}
                      disabled={selectedFiles.length === 0 || isLoading}
                      onClick={handleFileUpload}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-md text-primary absolute inset-0 flex items-center justify-center"></span>
                          <span className="opacity-0">Upload</span>
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  )}
                  <button
                    className="btn"
                    onClick={()=>{document.getElementById('my_modal_6').checked = false}}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
	    </div>
            
    );
  };
  
  export default UploadModal;
  
