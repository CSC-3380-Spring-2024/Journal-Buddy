import { Button } from "react-native"

export interface ButtonInput {
    buttonText: string,
    onPress: () => void,
    textStyle?: any,
    containerStyle?: any,
    children?: React.JSX.Element
    enabled?: boolean
}

export interface CheckboxInput extends ButtonInput{
    checked?: boolean
}

export type Quotes = {
    q: string,
    a: string
}

export type Habit = {
    task: string,
    isDone: boolean,
    id: string,
    index?: Number
}
