1.  ionic start Ionic-ImageUploadTest blank
2.  cd Ionic-ImageUploadTest
3.  cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-camera.git
4.  cordova plugin add org.apache.cordova.file
5.  cordova plugin add org.apache.cordova.file-transfer
6.  覆盖www目录
7.  ionic platform add android
8.  ionic build

##C#版服务端代码：
```
        public PostUploadResponse ImgUpload()
        {
            PostUploadResponse response = new PostUploadResponse();

            HttpContext context = HttpContext.Current;

            context.Response.ContentType = "text/plain";
            context.Response.Charset = "utf-8";

            // fileAddPic为app端FileUploadOptions传入参
            HttpPostedFile file = context.Request.Files["fileAddPic"];

            string fileName = "phone_" + file.FileName;

            string folder = "~/upload";

            string uploadPath = HttpContext.Current.Server.MapPath(folder + "\\");

            if (file != null)
            {
                file.SaveAs(uploadPath + fileName);
                response.Message = "上传成功";
                response.Success = true;
                response.ReturnUrl = "http://xxxxxxx/upload/" + fileName;
            }
            else
            {
                response.Message = "上传失败";
                response.Success = false;
                response.ReturnUrl = "";
            }
            return response;

        }

```