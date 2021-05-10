from rest_framework.renderers import JSONRenderer
from rest_framework.views import exception_handler


class ApiResponseRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response_data = {
            'success': True,
            'error': None,
            'errorMessage': None,
            'data': data,
        }

        # get class has serializer
        if hasattr(renderer_context.get('view'), 'get_serializer'):
            getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'objects')

        # call super to render the response
        response = super(ApiResponseRenderer, self).render(response_data, accepted_media_type, renderer_context)
        return response

    def custom_exception_handler(exc, context):
        # Call REST framework's default exception handler first,
        # to get the standard error response.
        response = exception_handler(exc, context)
        # Now add the HTTP status code to the response.
        if response is not None:
            errors = []
            message = response.data.get('detail')
            if not message:
                for field, value in response.data.items():
                    errors.append("{} : {}".format(field, " ".join(value)))
                response.data = {'data': [], 'message': 'Validation Error', 'errors': errors, 'status': 'failure'}
            else:
                response.data = {'data': [], 'message': message, 'error': [message], 'success': 'failure'}
        return response
