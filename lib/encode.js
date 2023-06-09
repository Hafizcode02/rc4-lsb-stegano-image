window.onload = function () {
    console.log('>>image_processing::active');

    /*-------------------------------------------- */

    const canvas_container = document.getElementById('_canvas_container');
    const _canvas_original = document.getElementById('_input_image');
    const _canvas_processed = document.getElementById("_encrypted_image");
    const _message = document.getElementById("_input_msg");
    const hide_msg_button = document.getElementById('hide_msg');
    const image_upload = document.getElementById('_image_upload');
    const _custom_key = document.getElementById('_custom_key_');

    const ctx_original = _canvas_original.getContext('2d');
    const ctx_processed = _canvas_processed.getContext('2d');

    /*creating a new image object */
    var imageOBJ = new Image();
    imageOBJ.onload = function () {
        let w = _canvas_original.width;
        let n_h = imageOBJ.naturalHeight;
        let n_w = imageOBJ.naturalWidth;
        //finding aspect ratio
        let aspect_ratio = n_w / n_h;
        let h = w / aspect_ratio;
        _canvas_original.height = h;

        //drawing image to canvas
        ctx_original.drawImage(imageOBJ, 0, 0, w, h);
    }

    /*when file is uploaded */
    image_upload.addEventListener('change', function (event) {
        image_src = URL.createObjectURL(event.target.files[0]);
        imageOBJ.src = image_src;
        if (canvas_container.style.display === "none") {
            canvas_container.style.display = "block";
        }
    });

    /* download canvas image when canvas is clicked*/
    _canvas_processed.addEventListener('click', (e) => {
        //get canvas data  
        var image = _canvas_processed.toDataURL();

        //create temporary link  
        var tmpLink = document.createElement('a');
        tmpLink.download = 'processedImage.png';

        //set the name of the download file 
        tmpLink.href = image;

        //temporarily add link to body and initiate the download  
        document.body.appendChild(tmpLink);
        tmpLink.click();
        document.body.removeChild(tmpLink);
    });


    /*hide msg button in clicked */
    hide_msg_button.addEventListener('click', function (e) {

        if (_message.value.length <= 0) {
            alert("please enter the message");
            return false;
        }
        if (image_upload.files.length <= 0) {
            alert("please upload an image");
            return false;
        }

        let customKeyString = _custom_key.value.length == 0 ? 'Jawa' : _custom_key.value;

        /*Encrypting Message*/
        var _encryptedMessage = rc4Encrypt(_message.value, customKeyString);

        /*processing message*/
        var _msgData = Tools.encode_message(_encryptedMessage).bits;

        /*process image*/
        var _imgData = ctx_original.getImageData(0, 0, _canvas_original.width, _canvas_original.height);

        /*check whether msg can be hidden in image or not */
        if (_msgData.length > _imgData.data.length) {
            console.log("need a large size image to accomodate the msg,\n go open an issue on gitHub, what else can you do?");
            return false;
        }

        /*superimpose image and messgae*/
        var _processed_data = Tools.superimpose(_imgData.data, _msgData);
        _imgData.data = _processed_data;

        /*setting up canvas dimentions */
        _canvas_processed.width = _canvas_original.width;
        _canvas_processed.height = _canvas_original.height;

        /*drawing in canvas */
        ctx_processed.putImageData(_imgData, 0, 0);

        var after_info = document.getElementById('after_info');
        if (after_info.style.display === "none") {
            after_info.style.display = "block";
        }
    });
}
