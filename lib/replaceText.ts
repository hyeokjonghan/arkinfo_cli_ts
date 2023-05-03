export const replaceInfraDescription = (description: string) => {
    const patternUp = /<@cc.vup>(.*?)<\/>/g;
    const patternDown = /<@cc.vdown>(.*?)<\/>/g;
    const patternKw = /<@cc.kw>(.*?)<\/>/g;
    const patternDelete = /<\$cc\.(.*?)>(.*?)<\/>/g;
    const deleteRemPattern = /<@cc.rem>/g;

    const patternUpTag = "<span class='text-color'>$1</span>"
    const patternDownTag = "<span class='danger-color'>$1</span>"
    const patternKwTag = "<span class='text-color'>$1</span>"
    const patternDeleteTag = "$2"

    description = description.replace(patternUp, patternUpTag)
    description = description.replace(patternDown, patternDownTag)
    description = description.replace(patternKw, patternKwTag)
    description = description.replace(patternDelete, patternDeleteTag)
    description = description.replace(deleteRemPattern, "")

    return description
}

export const replaceTalentDescription = (description: string) => {
    const pattern = /<@ba.talpu>(.*?)<\/>/g;
    const patternTag = "<span class='text-color'>$1</span>"

    const deletePattern = /<\$ba\.(.*?)>/g;
    const patternDeleteTag = ""
    
    description = description.replace(pattern, patternTag)
    description = description.replace(deletePattern, "")
    
    return description
}