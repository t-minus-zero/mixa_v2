"use client";

import { useState } from "react";
import { api } from "MixaDev/trpc/react";

export function LatestMix() {
  const utils = api.useUtils();
  const [jsonContent, setJsonContent] = useState(
    {
      "id": "root",
      "tag": "DIV",
      "title": "none",
      "classes": [
        "kono",
        "classy"
      ],
      "css": "",
      "content": "",
      "childrens": [
        {
          "id": "b95d3cb5-6f3b-4f08-90aa-7242363da275",
          "tag": "DIV",
          "title": "none",
          "classes": [
            "baka"
          ],
          "css": "",
          "childrens": []
        },
        {
          "id": "1b902eff-0cd7-41fc-8ded-cba5c7f6cb1d",
          "tag": "DIV",
          "title": "none",
          "classes": [
            "none"
          ],
          "css": "",
          "childrens": []
        },
        {
          "id": "c6759295-8e50-4474-96ad-f3eb4c54a7d5",
          "tag": "DIV",
          "title": "none",
          "classes": [
            "karate"
          ],
          "css": "",
          "childrens": []
        },
        {
          "id": "ee8fdfef-685f-4f9f-afc8-daebf6d98ea3",
          "tag": "DIV",
          "title": "none",
          "classes": [
            "none"
          ],
          "css": "",
          "childrens": []
        }
      ]
    }
);

  const createMix = api.mixRouter.createMix.useMutation({
    onSuccess: async () => {
      await utils.mixRouter.invalidate();
    },
  });

  const replaceMixById = api.mixRouter.replaceMixById.useMutation({
    onSuccess: async () => {
      await utils.mixRouter.invalidate();
    },
  });

  return (
    <div className="w-full max-w-xs">
        <button
          onClick={(e) => {
            e.preventDefault();
            createMix.mutate({ jsonContent });
            console.log("jsonContent", jsonContent);
          }}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createMix.isPending}
        >
          {createMix.isPending ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            replaceMixById.mutate({ id:18, jsonContent });
            console.log("jsonContent", jsonContent);
          }}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={replaceMixById.isPending}
        >
          {replaceMixById.isPending ? "Updating..." : "Update Mix"}
        </button>
    </div>
  );
}
