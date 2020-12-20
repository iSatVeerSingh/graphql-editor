import { createContainer } from 'unstated-next';
import { useState, useRef, useCallback } from 'react';
import { ParserTree, ParserField } from 'graphql-zeus';
const useTreesStateContainer = createContainer(() => {
  const [tree, setTree] = useState<ParserTree>({ nodes: [] });
  const [libraryTree, setLibraryTree] = useState<ParserTree>({ nodes: [] });
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [undos, setUndos] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<ParserField>();
  const selectedNodeRef = useRef<HTMLDivElement>(null);
  const [readonly, setReadonly] = useState(false);
  const [isTreeInitial, setIsTreeInitial] = useState(true);

  const [position, setPosition] = useState<{
    offsetLeft: number;
    offsetTop: number;
    width: number;
  }>();

  const past = () => {
    const p = snapshots.pop();
    if (p) {
      setUndos((u) => [...u, p]);
      setSnapshots([...snapshots]);
      return p;
    }
  };

  const future = () => {
    const p = undos.pop();
    if (p) {
      setUndos([...undos]);
      setSnapshots((s) => [...s, p]);
      return p;
    }
  };

  const relatedToSelected = useCallback(() => {
    const node =
      tree.nodes.find((n) => n.name === selectedNode?.name && n.data.type === selectedNode.data.type) ||
      libraryTree.nodes.find((n) => n.name === selectedNode?.name && n.data.type === selectedNode.data.type);
    if (node) {
      return node.args?.map((a) => a.type.name);
    }
  }, [selectedNode]);

  return {
    tree,
    setTree,
    libraryTree,
    setLibraryTree,
    snapshots,
    setSnapshots,
    selectedNode,
    setSelectedNode,
    selectedNodeRef,
    position,
    setPosition,
    past,
    undos,
    setUndos,
    future,
    relatedToSelected,
    readonly,
    setReadonly,
    isTreeInitial,
    setIsTreeInitial,
  };
});

export const useTreesState = useTreesStateContainer.useContainer;
export const TreesStateProvider = useTreesStateContainer.Provider;
