class HttpResponse {
    static S = {
      Success: 200,
      BadRequest: 400, //validation errors / invalid signature
      Unauthorized: 401, //expired token, invalid token
      NotFound: 404,//object not exists, method not exists, etc
      InternalServerError: 500,//logical errors
    }

    static PRE_MSG = {
        Success: "Success",
        BadRequest: "Bad Request",
        Unauthorized: "Unauthorized",
        NotFound: "NotFound",
        InternalServerError: "System Error"
      }

    /**
     * @status HttpUtil.STATUS
     * @message descriptive error message
     */
     static send(status, message="") {
        let res = {};
        let formattedMsg = "";
        let errorType = "";

        switch (status) {
            case this.S.Success:
                errorType = this.PRE_MSG.Success;
                formattedMsg = JSON.stringify(message);
                break;

            case this.S.BadRequest:
                errorType = this.PRE_MSG.BadRequest;
                formattedMsg = `${this.PRE_MSG.BadRequest}: ${JSON.stringify(message)}`;
                break;

            case this.S.Unauthorized:
                errorType = this.PRE_MSG.Unauthorized;
                formattedMsg = `${this.PRE_MSG.Unauthorized}: ${ (message)? message : "Access Denied" }`;
                break;

            case this.S.NotFound:
                errorType = this.PRE_MSG.NotFound;
                formattedMsg = `${this.PRE_MSG.NotFound}: ${ (message)? message : "The resource is not found." }`;
                break;

            case this.S.InternalServerError:
                errorType = this.PRE_MSG.InternalServerError;
                formattedMsg = `${this.PRE_MSG.InternalServerError}: ${JSON.stringify(message)}`;
                break;

            default:
                break;
        }

        res = {
            statusCode: status,
            headers: {
                "Content-Type": "text/plain"
            },
            isBase64Encoded: false,
            body: formattedMsg,
        };

        if(status === this.S.Success){
            return { result: res, error: null };
        }

        return { result: null, error: res };
    }
};

module.exports = HttpResponse;