from rest_framework.renderers import JSONRenderer
from rest_framework.views import exception_handler


class ApiResponseRenderer(JSONRenderer):

    def render(self, data, accepted_media_type=None, renderer_context=None):
        # get class has serializer
        # if hasattr(renderer_context.get('view'), 'get_serializer'):
        #     getattr(renderer_context.get('view').get_serializer().Meta, 'resource_name', 'objects')

        if renderer_context is not None:
            context_response = renderer_context['response']
            status_code = context_response.status_code
            if status_code < 200 or 299 < status_code:
                response_data = {
                    'success': False,
                    'data': None,
                    'error': data,
                    # 'error_message': context_response['error_message'],
                }
                response = super(ApiResponseRenderer, self).render(response_data, accepted_media_type, renderer_context)
                return response
            else:
                context_response.status_code = 200

        # call super to render the response
        response_data = {
            'success': True,
            'data': data,
            'error': None,
            'error_message': None,
        }

        response = super(ApiResponseRenderer, self).render(response_data, accepted_media_type, renderer_context)
        return response

    def _render_success(self, data, accepted_media_type=None, renderer_context=None):
        pass

    def _render_error(self, error, accepted_media_type=None, renderer_context=None):
        pass


def api_exception_handler(exception, context):
    err_detail = exception.detail
    err_code = exception.get_codes()
    response = exception_handler(exception, context)
    if response is not None:
        errors = []
        error_detail = response.data.get('detail')
        if not error_detail:
            # validation error
            for field, value in response.data.items():
                errors.append("{} : {}".format(field, " ".join(value)))
            response['error'] = errors
            response['error_messaage'] = 'Invalid inputs'
        else:
            # other error
            response['error'] = err_code
            response['error_message'] = str(err_detail)
        return response
    return response
