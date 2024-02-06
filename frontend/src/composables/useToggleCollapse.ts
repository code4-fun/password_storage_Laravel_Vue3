import type {Ref} from "vue";
import {ref} from "vue";
import type {Collapsible} from "@/types";

export default function useToggleCollapse(){
  const expandedNodes: Ref<number[]> = ref([])

  const toggleCollapse = (node: Collapsible) => {
    if (isExpanded(node)) {
      expandedNodes.value = expandedNodes.value.filter(id => id !== node.id)
    } else {
      expandedNodes.value.push(node.id)
    }
  }

  const isExpanded = (node: Collapsible) => {
    return expandedNodes.value.includes(node.id)
  }

  return {
    toggleCollapse,
    isExpanded
  }
}
