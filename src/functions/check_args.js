//las reglas para asignar los rangos de argumentos son:
//args : 1; indica que los argumentos son exactamente 1
//args : 1-3; indica que los argumentos son entre 1 y 3 (incluyendo 1 y 3)
//args : 1,3,4; indica que los argumentos pueden ser 1, 3 o 4

const check_args = (args_range, args_length) => {
  if (args_range.includes(",")) {
    const posible_args = args_range.split(",")

    for (let cuantity of posible_args) {
      if (cuantity == args_length) {
        return true
      }
    }
    return false

  } else if (args_range.includes("-")) {
    const args_ranges = args_range.split("-")

    if(args_length > args_ranges[0] && args_length < args_ranges[1]) return true
    else return false 

  } else {
    if(args_range == args_length) return true
    else return false

  }
}

module.exports = check_args
