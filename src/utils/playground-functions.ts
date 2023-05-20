export const checkPosition = (x:number,y:number):string => {
    
    if (Math.sqrt(Math.abs(x-635)**2 + Math.abs(y-425)**2)<50) return 'town'
    if (Math.sqrt(Math.abs(x-440)**2 + Math.abs(y-813)**2)<50) return 'elven'
    if (Math.sqrt(Math.abs(x-40)**2 + Math.abs(y-425)**2)<50) return 'necropolis'
    if (Math.sqrt(Math.abs(x-140)**2 + Math.abs(y-90)**2)<50) return 'dungeon'
    if (Math.sqrt(Math.abs(x-1420)**2 + Math.abs(y-530)**2)<50) return 'blue-dragon-dialog'
    if (Math.sqrt(Math.abs(x-738)**2 + Math.abs(y-154)**2)<50) return 'ironforge'
    return 'nada'
}