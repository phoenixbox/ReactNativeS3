/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import UUID from 'uuid';
import Button from 'react-native-button';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';

// const AWS_ACCESS_KEY_ID = ""; // YOUR_AWS_ACCESS_KEY_ID
// const AWS_SECRET_ACCESS_KEY = ""; // YOUR_AWS_SECRET_ACCESS_KEY
// const AWS_BUCKET_NAME = ""; // YOUR_AWS_BUCKET_NAME
// const AWS_BUCKET_REGION = ""; // YOUR_AWS_BUCKET_REGION

class ReactNativeS3 extends Component {
  constructor(props) {
    super(props);
  }

  triggerImagePicker() {
    const IMAGE_PICKER_OPTIONS = {
      title: 'Pick a photo from...',
      takePhotoButtonTitle: null,
      chooseFromLibraryButtonTitle: 'Your Camera Roll',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let file = {
          // `uri` can also be a file system path (i.e. file://)
          uri: response.uri,
          name: `${UUID.v4()}.png`,
          type: "image/png"
        }

        const s3Options = {
          keyPrefix: "uploads/",
          bucket: AWS_BUCKET_NAME,
          region: AWS_BUCKET_REGION,
          accessKey: AWS_ACCESS_KEY_ID,
          secretKey: AWS_SECRET_ACCESS_KEY,
          successActionStatus: 201
        }

        RNS3.put(file, s3Options).then(response => {
          if (response.status !== 201) {
            throw new Error("Failed to upload image to S3");
          }
          console.log('SUCESS: ', response.body);
          /**
          * {
          *   postResponse: {
          *     bucket: "your-bucket",
          *     etag : "9f620878e06d28774406017480a59fd4",
          *     key: "uploads/image.png",
          *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
          *   }
          * }
          */
        })
        .catch((error) => {
          console.log('****** Error: ', error)
        })
        .progress((e) => console.log('UPLOAD PROGRESS: ', e.loaded / e.total));
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Ola!
        </Text>
        <Text style={styles.subheader}>
          Upload to your AWS S3 using react-native-aws3.
        </Text>
        <Button style={styles.pickerButton} onPress={this.triggerImagePicker.bind(this)}>
          <View style={styles.pickerView}>
            <Text>PICK IMAGE</Text>
          </View>
        </Button>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  subheader: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
  pickerButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderColor: '#333333',
  },
  pickerView: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 10,
    height: 40,
    width: 150,
    marginTop: 30,
    borderRadius: 5
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginTop: 40,
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ReactNativeS3', () => ReactNativeS3);
