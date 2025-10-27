import z from 'zod'

const EstructuraValidador=z.object({
        id:z.int({
            invalid_type_error:'Id must be a integer',
            required_error:'Id is required'
        }).min(0),
        name:z.string({
            invalid_type_error:'name must be a string',
            required_error:'name required'
        }),
        ki:z.int({
            invalid_type_error:'ki must be a integer',
            required_error:'ki required'
        }),
        maxKi:z.string(),
        race:z.string(),
        gender:z.string(),
        description:z.string(),
        image:z.string().url(),
        affiliation:z.string(),
        //hace que si no se le pasa este cmapo, automaticamente se pone null. Hay muchas maneras de hacer esto
        deletedAt:z.string().default(null)
    })

//esta parte valida toido el registro
export function ValidandoGuerrero(Guerrero){
    return EstructuraValidador.safeParse(Guerrero)
}

//esta parate solo valida partes de un registro ya guardado(si no le pasas algunos atributos normal va validar al usar la misma estructura de validations)
//ya que le pusimos "partial()", esto hace que sean opcionales las validaciones
export function ValidarParcialmnetePeleadores(Guerrero) {
    return EstructuraValidador.partial().safeParse(Guerrero)
}

