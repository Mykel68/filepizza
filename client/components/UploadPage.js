import Arrow from './Arrow';
import DropZone from './DropZone';
import React from 'react';
import Tempalink from './Tempalink';
import UploadActions from '../actions/UploadActions';
import UploadStore from '../stores/UploadStore';
import socket from '../socket';

export default class UploadPage extends React.Component {

  constructor() {
    this.state = UploadStore.getState();

    this._onChange = () => {
      this.setState(UploadStore.getState());
    };

    this._onDownload = (peerID) => {
      UploadActions.sendToDownloader(peerID);
    };
  }

  componentDidMount() {
    UploadStore.listen(this._onChange);
    socket.on('download', this._onDownload);
  }

  componentDidUnmount() {
    UploadStore.unlisten(this._onChange);
    socket.removeListener('download', this._onDownload);
  }

  uploadFile(file) {
    UploadActions.uploadFile(file);
  }

  render() {
    switch (this.state.status) {
      case 'ready':
        return <div className="upload-page">
          <DropZone onDrop={this.uploadFile.bind(this)} />
          <Arrow dir="up" />
          <h1>WebDrop</h1>
          <p>The easiest way to send someone a file.</p>
          <p>Drag the file into this window to get started.</p>
        </div>;

      case 'processing':
        return <div className="upload-page">
          <Arrow dir="up" animated />
          <h1>WebDrop</h1>
          <p>Processing...</p>
        </div>;

      case 'uploading':
        return <div className="upload-page">

          <Arrow dir="up" animated {...this.state.file} />

          <Tempalink token={this.state.token} />
          <p>Send someone this link to download.</p>
          <p>This link will work as long as this page is open.</p>

          <div className="data">
            <div className="datum"><strong>In Progress:</strong> {this.state.inProgress}</div>
            <div className="datum"><strong>Completed:</strong> {this.state.completed}</div>
          </div>

        </div>;
    }
  }

}
