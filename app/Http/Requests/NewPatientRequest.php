<?php

namespace App\Http\Requests;

use App\Http\Requests\Request;

class NewPatientRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name'=>'required',
            'last_name'=>'required',
            'address'=>'required',
            'nation'=>'required',
            'city'=>'required',
            'email'=>'required|email',
        ];
    }
}
